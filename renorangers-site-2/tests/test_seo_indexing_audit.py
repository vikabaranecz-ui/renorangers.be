"""Regression tests: priority index checks, rotating coverage, paid-page exclusion."""
import importlib.util
import os
import unittest
from datetime import date
from pathlib import Path

os.environ.setdefault("SEO_BASE_URL", "https://www.renorangers.be")
os.environ.setdefault("GSC_SITE_URL", "sc-domain:renorangers.be")
script=Path(__file__).resolve().parents[1]/"scripts"/"seo_indexing_audit.py"
spec=importlib.util.spec_from_file_location("reno_seo_indexing_audit",script)
audit=importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class PriorityAuditTests(unittest.TestCase):
    def setUp(self):
        self.urls=[f"https://www.renorangers.be/projecten/test-{i:03d}" for i in range(75)]

    def test_seven_business_and_unindexed_pages_always_checked(self):
        result=audit.select_urls(self.urls,date(2026,11,16))
        self.assertEqual(result[:7],audit.priority_urls())
        self.assertEqual(len(result),audit.LIMIT)
        self.assertEqual(len(result),len(set(result)))

    def test_rotating_nonpriority_sample(self):
        monday=audit.select_urls(self.urls,date(2026,11,16))
        next_week=audit.select_urls(self.urls,date(2026,11,23))
        self.assertEqual(monday[:7],next_week[:7])
        self.assertNotEqual(monday[7:],next_week[7:])

    def test_priority_checked_even_if_discovery_misses_url(self):
        self.assertEqual(audit.select_urls([]),audit.priority_urls())

    def test_paid_only_page_not_mandatory(self):
        self.assertFalse(any(u.endswith("/badkamerrenovatie-antwerpen") for u in audit.priority_urls()))


if __name__=="__main__":
    unittest.main()
