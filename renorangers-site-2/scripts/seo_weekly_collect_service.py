#!/usr/bin/env python3

import json, os, re
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import quote

import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly", "https://www.googleapis.com/auth/adwords"]
GSC_SITE = os.getenv("GSC_SITE_URL", "sc-domain:renorangers.be")
CUSTOMER_ID = re.sub(r"\D", "", os.getenv("GOOGLE_ADS_CUSTOMER_ID", "6046553882"))
DEV_TOKEN = os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN", "").strip()
API_VERSION = os.getenv("GOOGLE_ADS_API_VERSION", "v25")
OUTPUT = Path(os.getenv("SEO_WEEKLY_OUTPUT", "seo-weekly-context.json"))
TARGETS = Path("renorangers-site-2/seo/keyword_targets.json")
PROFILE = Path("renorangers-site-2/seo/business_profile.json")
TIMEOUT = 45


def credentials():
    raw = os.getenv("GOOGLE_ADC_JSON", "").strip()
    if not raw:
        raise RuntimeError("GOOGLE_ADC_JSON missing")
    info = json.loads(raw)
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    creds.refresh(Request())
    return creds.token


def gsc(token, start, end, dimensions, limit):
    url = f"https://www.googleapis.com/webmasters/v3/sites/{quote(GSC_SITE, safe='')}/searchAnalytics/query"
    body = {"startDate": start.isoformat(), "endDate": end.isoformat(), "dimensions": dimensions, "rowLimit": limit, "dataState": "final"}
    r = requests.post(url, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, json=body, timeout=TIMEOUT)
    if r.status_code >= 400:
        raise RuntimeError(f"GSC HTTP {r.status_code}: {r.text[:900]}")
    names = dimensions
    out = []
    for row in r.json().get("rows", []):
        item = {names[i]: row.get("keys", [])[i] for i in range(min(len(names), len(row.get("keys", []))))}
        item.update({k: row.get(k) for k in ("clicks", "impressions", "ctr", "position")})
        out.append(item)
    return out


def _as_int(value):
    try:
        return int(value or 0)
    except (TypeError, ValueError):
        return 0


BASE_SEEDS = [
    "renovatiebedrijf antwerpen", "totaalrenovatie antwerpen",
    "badkamerrenovatie antwerpen", "aannemer renovatie antwerpen",
    "binnenafwerking antwerpen", "aannemer voor architecten",
]

def build_weekly_seeds(target_rows, gsc_data, as_of=None, limit=20):
    """Stable services + the newest observed GSC queries + rotating target keywords."""
    reference = as_of or date.today()
    selected = []
    seen = set()
    def add(value):
        value = str(value or "").strip()
        low = value.casefold()
        if not low or low in seen or len(selected) >= limit or "reno rangers" in low:
            return
        # Broad unqualified DIY, material shopping and new-build demand do not fit Reno.
        if any(term in low for term in ("nieuwbouw", "zelf doen", "doe het zelf", "bouwmateriaal kopen")):
            return
        seen.add(low)
        selected.append(value)
    for seed in BASE_SEEDS:
        add(seed)

    rows = gsc_data.get("current_queries", []) if isinstance(gsc_data, dict) else []
    relevant = [r for r in rows
                if (r.get("impressions") or 0) >= 5
                and any(term in str(r.get("query") or "").lower()
                        for term in ("renov", "aannemer", "badkamer", "binnenafwerking", "architect"))]
    relevant.sort(key=lambda r: (4 <= (r.get("position") or 999) <= 20,
                                  r.get("impressions") or 0), reverse=True)
    for row in relevant[:8]:
        add(row.get("query"))

    targets = [r.get("keyword") for r in target_rows if r.get("keyword")]
    offset = reference.isocalendar().week * 7 % max(1, len(targets))
    for kw in targets[offset:] + targets[:offset]:
        add(kw)
    return selected


MONTHS = ("JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST",
          "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER")
def keyword_history(metrics):
    vals = []
    for row in metrics.get("monthlySearchVolumes", []) or []:
        try:
            m = row.get("month")
            month = int(m) if isinstance(m, int) else MONTHS.index(str(m).upper()) + 1
            year = int(row["year"])
            volume = row.get("monthlySearches")
            if 1 <= month <= 12 and volume is not None:
                vals.append({"year": year, "month": month, "searches": int(volume)})
        except (ValueError, TypeError, KeyError):
            continue
    vals.sort(key=lambda v:(v["year"],v["month"]))
    a,b=vals[-3:],vals[-6:-3]
    recent=sum(x["searches"] for x in a)/3 if len(a)==3 else None
    previous=sum(x["searches"] for x in b)/3 if len(b)==3 else None
    return {"recent_3m_avg":round(recent,1) if recent is not None else None,
            "previous_3m_avg":round(previous,1) if previous is not None else None,
            "trend_3m_vs_prior_3m_pct":round((recent/previous-1)*100,1) if recent is not None and previous and previous>0 else None,
            "trend_observation_end":f'{a[-1]["year"]}-{a[-1]["month"]:02d}' if a else None,
            "monthly_search_volumes":vals[-12:]}


def ads(token, geo_id, seeds):
    if not DEV_TOKEN:
        raise RuntimeError("GOOGLE_ADS_DEVELOPER_TOKEN missing")
    cleaned = [str(s).strip() for s in seeds if str(s).strip()][:20]
    if not cleaned:
        raise RuntimeError("No keyword seeds available")
    url = f"https://googleads.googleapis.com/{API_VERSION}/customers/{CUSTOMER_ID}:generateKeywordIdeas"
    headers = {"Authorization": f"Bearer {token}", "developer-token": DEV_TOKEN, "Content-Type": "application/json"}
    body = {
        "language": "languageConstants/1010",
        "geoTargetConstants": [f"geoTargetConstants/{geo_id}"],
        "keywordSeed": {"keywords": cleaned},
        "keywordPlanNetwork": "GOOGLE_SEARCH"
    }
    r = requests.post(url, headers=headers, json=body, timeout=60)
    if r.status_code >= 400:
        raise RuntimeError(f"Google Ads HTTP {r.status_code}: {r.text[:1200]}")
    ideas = []
    for row in r.json().get("results", []):
        m = row.get("keywordIdeaMetrics") or {}
        ideas.append({
            "keyword": row.get("text"),
            "avg_monthly_searches": _as_int(m.get("avgMonthlySearches")),
            "competition": m.get("competition"),
            "competition_index": _as_int(m.get("competitionIndex")),
            **keyword_history(m)
        })
    ideas.sort(key=lambda x: x.get("avg_monthly_searches", 0), reverse=True)
    return ideas[:400]


def main():
    target_data = json.loads(TARGETS.read_text(encoding="utf-8"))
    profile = json.loads(PROFILE.read_text(encoding="utf-8"))
    target_rows = target_data.get("primary_targets") or target_data.get("targets") or []
    token = credentials()
    end = date.today() - timedelta(days=2)
    cur_start = end - timedelta(days=27)
    prev_end = cur_start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=27)

    result = {
        "generated_at": date.today().isoformat(),
        "profile": profile,
        "keyword_targets": target_rows,
        "gsc": {},
        "google_ads": {},
    }

    try:
        result["gsc"] = {
            "site": GSC_SITE,
            "current_period": [cur_start.isoformat(), end.isoformat()],
            "previous_period": [prev_start.isoformat(), prev_end.isoformat()],
            "current_queries": gsc(token, cur_start, end, ["query"], 5000),
            "current_pages": gsc(token, cur_start, end, ["page"], 2000),
            "current_query_pages": gsc(token, cur_start, end, ["query", "page"], 8000),
            "previous_queries": gsc(token, prev_start, prev_end, ["query"], 5000),
            "previous_pages": gsc(token, prev_start, prev_end, ["page"], 2000),
            "context_90d_query_pages": gsc(token, end - timedelta(days=89), end, ["query", "page"], 12000)
        }
    except Exception as exc:
        result["gsc"] = {"error": str(exc)}

    # Each market is independent; never silently replace missing Antwerp demand
    # with Belgium numbers. Each call uses the current week's evidence-led seeds.
    seeds = build_weekly_seeds(target_rows, result.get("gsc"))
    ads_result = {"customer_id": CUSTOMER_ID, "seeds": seeds,
                  "seed_provenance": "Six verified service topics + latest relevant GSC + rotating KPI terms",
                  "demand_note": "Google Ads monthly estimates (not real-time searches); paid competition is NOT organic keyword difficulty."}
    for key, geo in (("antwerp_province", "20053"), ("belgium", "2056")):
        try:
            ads_result[key] = ads(token, geo, seeds)
        except Exception as exc:
            ads_result[key] = {"error": str(exc)}
    if isinstance(ads_result.get("antwerp_province"), dict):
        ads_result["error"] = "Antwerp Keyword Planner unavailable: " + ads_result["antwerp_province"]["error"]
    result["google_ads"] = ads_result

    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT}")
    if isinstance(result.get("gsc"), dict) and result["gsc"].get("error"):
        print("GSC_ERROR", result["gsc"]["error"])
    if isinstance(result.get("google_ads"), dict) and result["google_ads"].get("error"):
        print("ADS_ERROR", result["google_ads"]["error"])


if __name__ == "__main__":
    main()
