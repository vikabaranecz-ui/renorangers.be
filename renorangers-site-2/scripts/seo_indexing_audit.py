#!/usr/bin/env python3
"""Read-only Google Search Console URL Inspection audit, no indexing submissions."""
import json
import os
import sys
import xml.etree.ElementTree as ET
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import quote, urlparse

import requests
from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account

SITE=os.environ["SEO_BASE_URL"].rstrip("/")
PROPERTY=os.environ["GSC_SITE_URL"]
LIMIT=30

def owned(url):
    try:
        p=urlparse(url)
        host=urlparse(SITE).hostname
        return p.scheme=="https" and p.hostname in (host,host.removeprefix("www.") if host else "")
    except (TypeError,ValueError):
        return False

def discover(api):
    urls={SITE+"/"}
    sitemap_error=None
    try:
        response=requests.get(SITE+"/sitemap.xml",timeout=20)
        response.raise_for_status()
        root=ET.fromstring(response.content)
        for node in root.iter():
            if node.tag.rsplit("}",1)[-1]=="loc" and node.text and owned(node.text.strip()):
                urls.add(node.text.strip().split("#")[0])
    except (requests.RequestException,ET.ParseError,ValueError) as exc:
        sitemap_error=type(exc).__name__
    search_error=None
    try:
        endpoint="https://searchconsole.googleapis.com/webmasters/v3/sites/"+quote(PROPERTY,safe="")+"/searchAnalytics/query"
        today=date.today()-timedelta(days=3)
        response=api.post(endpoint,json={"startDate":str(today-timedelta(days=89)),
                                        "endDate":str(today),"dimensions":["page"],"rowLimit":5000},
                          timeout=25)
        response.raise_for_status()
        for row in response.json().get("rows",[]):
            keys=row.get("keys",[])
            if keys and owned(keys[0]):
                urls.add(keys[0].split("#")[0])
    except (requests.RequestException,ValueError,TypeError) as exc:
        search_error=type(exc).__name__
    return sorted(urls),sitemap_error,search_error

def main():
    raw=os.environ.get("GOOGLE_ADC_JSON","").strip()
    if not raw:
        raise SystemExit("Missing existing Google ADC secret; no indexing audit run.")
    try:
        info=json.loads(raw)
        creds=service_account.Credentials.from_service_account_info(
            info,scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
        api=AuthorizedSession(creds)
    except Exception as exc:
        raise SystemExit("Google authentication failed: "+type(exc).__name__)
    urls,sitemap_error,search_error=discover(api)
    findings=[]
    for url in urls[:LIMIT]:
        try:
            response=api.post("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
                              json={"inspectionUrl":url,"siteUrl":PROPERTY},timeout=25)
            if response.status_code!=200:
                findings.append({"url":url,"status":"API_ERROR","http":response.status_code})
                continue
            state=response.json().get("inspectionResult",{}).get("indexStatusResult",{})
            findings.append({"url":url,"status":"INSPECTED","verdict":state.get("verdict"),
                             "coverage":state.get("coverageState"),"robots":state.get("robotsTxtState"),
                             "indexing":state.get("indexingState"),"fetch":state.get("pageFetchState"),
                             "google_canonical":state.get("googleCanonical"),
                             "user_canonical":state.get("userCanonical"),
                             "last_crawl":state.get("lastCrawlTime")})
        except (requests.RequestException,ValueError,TypeError) as exc:
            findings.append({"url":url,"status":"API_ERROR","error":type(exc).__name__})
    output={"property":PROPERTY,"site":SITE,"discovered_urls":len(urls),
            "inspected_urls":len(findings),"uninspected_urls":max(0,len(urls)-LIMIT),
            "sitemap_error":sitemap_error,"search_analytics_error":search_error,
            "findings":findings,
            "limitations":"Not a complete Search Console Page indexing export. Redirects/duplicates may be intentional."}
    Path("seo-indexing-audit.json").write_text(json.dumps(output,indent=2,ensure_ascii=False),encoding="utf-8")
    failures=[r for r in findings if r["status"]=="INSPECTED" and r.get("verdict")!="PASS"]
    print("Indexing evidence:",len(findings),"inspected;",len(failures),"non-PASS; API errors:",
          sum(r["status"]=="API_ERROR" for r in findings))
    for row in failures[:20]:
        print("REVIEW:",row["url"],row.get("coverage"),"canonical:",row.get("google_canonical"))
    summary=os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary,"a",encoding="utf-8") as f:
            f.write("## GSC Indexing audit (read-only)\n\n")
            f.write(f"- Site: {SITE}\n- URLs discovered: {len(urls)}\n- Inspected: {len(findings)}\n")
            f.write(f"- Non-PASS: {len(failures)} (not necessarily errors; review redirects and canonicals)\n")
            f.write(f"- API errors: {sum(r['status']=='API_ERROR' for r in findings)}\n")
            f.write(f"- Sitemap error: {sitemap_error or 'none'}\n")
            f.write("- Cannot enumerate all excluded URLs in GSC Pages report through the public API.\n")
    if not any(x["status"]=="INSPECTED" for x in findings):
        raise SystemExit("No URL Inspection API verdict returned; check property permissions.")

if __name__=="__main__":
    main()
