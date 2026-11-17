#!/usr/bin/env python3
"""Compact, source-labelled Google evidence for Reno's weekly SEO agent.

Google Ads offers historical *monthly estimates* (not live searches); GSC
observes recent clicks and impressions (not a complete ranking/index export).
"""
import json
import os
from pathlib import Path
from urllib.parse import urlparse

RAW = Path(os.getenv("SEO_WEEKLY_RAW", "seo-weekly-context.json"))
OUT = Path(os.getenv("SEO_WEEKLY_COMPACT", "seo-weekly-context-compact.json"))

def numeric(v):
    return v if isinstance(v, (int, float)) else 0

def top(rows, key="impressions", n=50):
    return sorted(rows or [], key=lambda x:numeric(x.get(key)), reverse=True)[:n]

def useful(kw):
    """Conservative service-intent gate, not just a substring in 'renovatie'."""
    q=str(kw or "").casefold()
    # Reno offers total renovation, bathrooms and interior finishing, not
    # roofing, facade insulation, products or implausible fixed turnaround.
    not_offered=(
        "gevel", "buitenmuur", "dak", "isolatie", "spouw", "nieuwbouw",
        "1 dag", "één dag", "eendag", "24 uur", "zelf doen",
        "doe-het-zelf", "bouwmateriaal", "renovatieplaten",
        "renovatieplaat", "winkel", "groothandel", "sanitair kopen",
        "tegels kopen", "prijs renovatieplaten", "reno rangers"
    )
    if not q or any(term in q for term in not_offered):
        return False
    return any(term in q for term in (
        "totaalrenov", "renovatiebedrijf", "aannemer renov",
        "aannemer antwerp", "renovatie woning", "woning renov",
        "renovatie appartement", "appartement renov", "renoveren appartement",
        "badkamer", "binnenafwerking", "interieur", "mortex",
        "renovatie antwerp", "renovatie kosten", "kosten renovatie"
    ))

def compact_ads(ads):
    if not isinstance(ads, dict):
        return {"error":"Missing Google Ads evidence"}
    local = ads.get("antwerp_province")
    belgium = ads.get("belgium")
    local_rows = local if isinstance(local,list) else []
    national_rows = belgium if isinstance(belgium,list) else []
    eligible = [r for r in local_rows if useful(r.get("keyword"))]
    rising = [r for r in eligible
              if numeric(r.get("avg_monthly_searches")) >= 30
              and isinstance(r.get("trend_3m_vs_prior_3m_pct"), (int,float))]
    rising.sort(key=lambda x:(x["trend_3m_vs_prior_3m_pct"],
                              numeric(x.get("avg_monthly_searches"))),reverse=True)
    return {
        "customer_id": ads.get("customer_id"),
        "error": ads.get("error"),
        "seeds": ads.get("seeds"),
        "seed_provenance": ads.get("seed_provenance"),
        "source_quality": {
            "antwerp": "OK" if isinstance(local,list) else "UNAVAILABLE",
            "belgium": "OK" if isinstance(belgium,list) else "UNAVAILABLE",
            "antwerp_error": local.get("error") if isinstance(local,dict) else None,
            "belgium_error": belgium.get("error") if isinstance(belgium,dict) else None,
        },
        "antwerp_top_relevant": top(eligible,"avg_monthly_searches",65),
        "antwerp_rising_3m": rising[:35],
        "belgium_top_relevant": top([r for r in national_rows if useful(r.get("keyword"))],
                                     "avg_monthly_searches",35),
        "limitations": "Estimated historical monthly searches; observation month shown per keyword. "
                       "Google Ads competition is PAID competition, not organic difficulty. "
                       "Do not sum close-variant volumes or infer same-day search trends.",
    }

def compact_gsc(gsc, target_rows):
    if not isinstance(gsc,dict) or gsc.get("error"):
        return {"error":gsc.get("error") if isinstance(gsc,dict) else "No GSC data"}
    current_queries=gsc.get("current_queries") or []
    current_pages=gsc.get("current_pages") or []
    current_qp=gsc.get("current_query_pages") or []
    previous_pages={r.get("page"):r for r in (gsc.get("previous_pages") or [])}
    query_lookup={str(r.get("query") or "").casefold():r for r in current_queries}

    scoreboard=[]
    for t in target_rows:
        kw=t.get("keyword")
        row=query_lookup.get(str(kw or "").casefold())
        imps=numeric(row.get("impressions")) if row else 0
        pos=row.get("position") if row else None
        scoreboard.append({
            "keyword":kw,"expected_url":t.get("target_url"),
            "position":pos,"impressions":imps,
            "clicks":numeric(row.get("clicks")) if row else 0,
            "confidence":"LOW_SAMPLE" if 0 < imps < 10 else ("OBSERVED" if imps>=10 else "NOT_SEEN")
        })

    pages=[]
    for r in top(current_pages,"impressions",60):
        old=previous_pages.get(r.get("page")) or {}
        pages.append({
            "page":r.get("page"),"clicks":r.get("clicks"),
            "impressions":r.get("impressions"),"position":r.get("position"),
            "previous_clicks":numeric(old.get("clicks")),
            "previous_impressions":numeric(old.get("impressions")),
            "click_delta":numeric(r.get("clicks"))-numeric(old.get("clicks")),
            "impression_delta":numeric(r.get("impressions"))-numeric(old.get("impressions")),
        })

    query_page_lookup={}
    for r in current_qp:
        q=str(r.get("query") or "").casefold()
        query_page_lookup.setdefault(q,[]).append(r)
    mapping=[]
    for s in scoreboard:
        expected=s.get("expected_url")
        if not expected or s["impressions"] < 10:
            continue
        rows=sorted(query_page_lookup.get(str(s["keyword"] or "").casefold(),[]),
                    key=lambda r:numeric(r.get("impressions")),reverse=True)
        for r in rows[:2]:
            actual=urlparse(r.get("page") or "").path or "/"
            if actual != expected and numeric(r.get("impressions"))>=5:
                mapping.append({
                    "keyword":s["keyword"],"expected_page":expected,
                    "observed_page":actual,"impressions":r.get("impressions"),
                    "position":r.get("position"),
                    "interpretation":"Mapping observation, NOT proof of harmful cannibalization"
                })

    raw_top5=sum(1 for r in scoreboard if isinstance(r["position"],(int,float)) and r["position"]<=5)
    credible_top5=sum(1 for r in scoreboard if isinstance(r["position"],(int,float))
                      and r["position"]<=5 and r["impressions"]>=10)
    return {
        "site":gsc.get("site"),"current_period":gsc.get("current_period"),
        "previous_period":gsc.get("previous_period"),
        "kpi_total":len(scoreboard),"top5_raw":raw_top5,
        "top5_at_least_10_impressions":credible_top5,
        "scoreboard":scoreboard,
        "current_pages_vs_previous":pages,
        "top_queries":top(current_queries,"impressions",75),
        "query_page_top":top(current_qp,"impressions",90),
        "ninety_day_query_page_top":top(gsc.get("context_90d_query_pages"),
                                       "impressions",75),
        "potential_page_mapping_conflicts":mapping[:35],
        "attributed_organic_leads":"NOT MEASURED — no authenticated conversion/CRM join in this collector",
        "limitations":"GSC positions are sampled averages; omitted rows do not prove a page cannot rank. "
                      "Google Search Console performance does not prove URL indexing status.",
    }

def build_digest(raw):
    targets=raw.get("keyword_targets") or []
    return {
        "generated_at":raw.get("generated_at"),
        "business":raw.get("profile",{}).get("business_name"),
        "data_provenance":"Google Search Console (finalized reporting data) and Google Ads Keyword Planner (historical monthly estimates)",
        "gsc":compact_gsc(raw.get("gsc"),targets),
        "keyword_planner":compact_ads(raw.get("google_ads")),
        "action_rules": [
            "Fix verified indexing/HTTP/canonical issues before adding new pages",
            "Improve existing correctly mapped service page before proposing a duplicate URL",
            "Only prepare a distinct new public page for verified intent with GSC or local demand evidence; open NEEDS APPROVAL PR, never silently merge",
            "For every claim give source, period, URL/keyword, action and future check",
            "No auto-published unsupported pricing, guarantees, work examples, geography or response-time claims",
        ]
    }

def main():
    raw=json.loads(RAW.read_text(encoding="utf-8"))
    out=build_digest(raw)
    OUT.write_text(json.dumps(out,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
    kp=out["keyword_planner"]
    gs=out["gsc"]
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
    print("GSC:",gs.get("error") or f"Top5 raw={gs.get('top5_raw')}, credible={gs.get('top5_at_least_10_impressions')}")
    print("Antwerp Keyword Planner:",kp.get("source_quality",{}).get("antwerp"))
    print("Rising local topics:",[(x.get("keyword"),x.get("trend_3m_vs_prior_3m_pct"))
                                  for x in kp.get("antwerp_rising_3m",[])[:10]])

if __name__=="__main__":
    main()
