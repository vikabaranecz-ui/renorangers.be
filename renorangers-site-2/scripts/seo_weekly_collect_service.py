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
            "competition_index": _as_int(m.get("competitionIndex"))
        })
    ideas.sort(key=lambda x: x.get("avg_monthly_searches", 0), reverse=True)
    return ideas[:400]


def main():
    target_data = json.loads(TARGETS.read_text(encoding="utf-8"))
    profile = json.loads(PROFILE.read_text(encoding="utf-8"))
    target_rows = target_data.get("primary_targets") or target_data.get("targets") or []
    seeds = []
    for row in target_rows:
        kw = row.get("keyword")
        if kw and kw not in seeds:
            seeds.append(kw)
        if len(seeds) >= 20:
            break

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
            "previous_queries": gsc(token, prev_start, prev_end, ["query"], 5000)
        }
    except Exception as exc:
        result["gsc"] = {"error": str(exc)}

    try:
        result["google_ads"] = {
            "customer_id": CUSTOMER_ID,
            "seeds": seeds,
            "belgium": ads(token, "2056", seeds),
            "antwerp_province": ads(token, "20053", seeds)
        }
    except Exception as exc:
        result["google_ads"] = {"error": str(exc)}

    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT}")
    if isinstance(result.get("gsc"), dict) and result["gsc"].get("error"):
        print("GSC_ERROR", result["gsc"]["error"])
    if isinstance(result.get("google_ads"), dict) and result["google_ads"].get("error"):
        print("ADS_ERROR", result["google_ads"]["error"])


if __name__ == "__main__":
    main()
