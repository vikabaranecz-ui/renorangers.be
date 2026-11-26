"""Contract tests for fresh keyword seeds, historical demand and GSC score quality."""
import importlib.util
import os
import unittest
from datetime import date
from pathlib import Path

os.environ.setdefault("SEO_BASE_URL","https://www.renorangers.be")
os.environ.setdefault("GSC_SITE_URL","sc-domain:renorangers.be")
ROOT=Path(__file__).resolve().parents[1]/"scripts"

def load(name):
    path=ROOT/name
    spec=importlib.util.spec_from_file_location(name.replace(".","_"),path)
    mod=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class DemandTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.collector=load("seo_weekly_collect_service.py")
        cls.digest=load("seo_evidence_digest.py")

    def test_recent_monthly_demand_not_realtime(self):
        months=("JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE")
        rows=[{"year":2026,"month":name,"monthlySearches":v}
              for name,v in zip(months,(10,10,10,20,20,20))]
        h=self.collector.keyword_history({"monthlySearchVolumes":rows})
        self.assertEqual(h["trend_3m_vs_prior_3m_pct"],100.0)
        self.assertEqual(h["trend_observation_end"],"2026-06")

    def test_no_synthetic_trend_without_six_months(self):
        self.assertIsNone(self.collector.keyword_history({})["trend_3m_vs_prior_3m_pct"])

    def test_seeds_track_observed_gsc_not_new_build(self):
        targets=[{"keyword":"aannemer renovatie"}]
        gsc={"current_queries":[
            {"query":"renovatiebedrijf borgerhout","impressions":88,"position":9},
            {"query":"nieuwbouw aannemer","impressions":900,"position":9},
        ]}
        seeds=self.collector.build_weekly_seeds(targets,gsc,date(2026,11,17))
        self.assertIn("renovatiebedrijf borgerhout",seeds)
        self.assertNotIn("nieuwbouw aannemer",seeds)
        self.assertLessEqual(len(seeds),20)

    def test_kpi_counts_separate_low_sample_wins(self):
        gsc={"current_period":["2026-10-18","2026-11-14"],
             "current_queries":[
                {"query":"aannemer","position":1.0,"impressions":2,"clicks":0},
                {"query":"renovatie","position":1.9,"impressions":39,"clicks":12},
             ],
             "current_pages":[],"current_query_pages":[]}
        targets=[{"keyword":"aannemer","target_url":"/"},
                 {"keyword":"renovatie","target_url":"/"}]
        out=self.digest.compact_gsc(gsc,targets)
        self.assertEqual(out["top5_raw"],2)
        self.assertEqual(out["top5_at_least_10_impressions"],1)
        self.assertEqual(out["scoreboard"][0]["confidence"],"LOW_SAMPLE")

    def test_reject_unoffered_rising_ideas(self):
        bad=("gevelrenovatie", "oude buitenmuur renoveren",
             "badkamer renovatie in 1 dag", "renovatieplaten badkamer",
             "dakrenovatie antwerpen", "nieuwbouw aannemer")
        for query in bad:
            self.assertFalse(self.digest.useful(query),query)
        good=("badkamerrenovatie", "totaalrenovatie Antwerpen",
              "aannemer voor architecten", "badkamer renovatie prijzen")
        for query in good:
            self.assertTrue(self.digest.useful(query),query)

    def test_missing_local_planner_not_replaced_with_national(self):
        data={"belgium":[{"keyword":"renovatie","avg_monthly_searches":1000}],
              "antwerp_province":{"error":"API unavailable"}}
        result=self.digest.compact_ads(data)
        self.assertEqual(result["source_quality"]["antwerp"],"UNAVAILABLE")
        self.assertEqual(result["antwerp_top_relevant"],[])


if __name__=="__main__":
    unittest.main()
