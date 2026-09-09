#!/usr/bin/env python3
import json
import re
import sys
from collections import defaultdict
from urllib.parse import urljoin, urlparse, urldefrag
from xml.etree import ElementTree as ET

import requests
from bs4 import BeautifulSoup

BASE = "https://www.renorangers.be"
SITEMAP = f"{BASE}/sitemap.xml"
TIMEOUT = 20
UA = "RenoRangersSEOQA/1.0 (+https://www.renorangers.be)"

session = requests.Session()
session.headers.update({"User-Agent": UA})


def norm(url):
    url = urldefrag(url)[0]
    p = urlparse(url)
    if p.scheme not in ("http", "https") or p.netloc not in ("www.renorangers.be", "renorangers.be"):
        return None
    scheme = "https"
    host = "www.renorangers.be"
    path = p.path or "/"
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    return f"{scheme}://{host}{path}" + (f"?{p.query}" if p.query else "")


def fetch(url, allow_redirects=True):
    try:
        return session.get(url, timeout=TIMEOUT, allow_redirects=allow_redirects)
    except Exception as e:
        return e


def sitemap_urls():
    r = fetch(SITEMAP)
    if isinstance(r, Exception) or r.status_code != 200:
        raise RuntimeError(f"sitemap fetch failed: {r}")
    root = ET.fromstring(r.text)
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    urls = []
    for loc in root.iter(ns + "loc"):
        n = norm((loc.text or "").strip())
        if n:
            urls.append(n)
    return list(dict.fromkeys(urls))


def text_len(soup):
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    return len(re.findall(r"\b\w+\b", soup.get_text(" ", strip=True)))


def main():
    urls = sitemap_urls()
    issues = []
    rows = []
    outgoing = defaultdict(set)
    incoming = defaultdict(set)

    for url in urls:
        raw = fetch(url, allow_redirects=False)
        if isinstance(raw, Exception):
            issues.append({"type": "fetch_error", "url": url, "detail": str(raw)})
            continue

        if 300 <= raw.status_code < 400:
            issues.append({"type": "sitemap_url_redirects", "url": url, "status": raw.status_code, "location": raw.headers.get("location")})
            final = fetch(url, allow_redirects=True)
        else:
            final = raw

        if isinstance(final, Exception):
            issues.append({"type": "fetch_error", "url": url, "detail": str(final)})
            continue

        if final.status_code != 200:
            issues.append({"type": "non_200", "url": url, "status": final.status_code})
            continue

        soup = BeautifulSoup(final.text, "html.parser")
        title = (soup.title.string or "").strip() if soup.title and soup.title.string else ""
        desc_tag = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
        desc = (desc_tag.get("content") or "").strip() if desc_tag else ""
        canonical_tag = soup.find("link", rel=lambda v: v and "canonical" in [x.lower() for x in (v if isinstance(v, list) else [v])])
        canonical = norm(canonical_tag.get("href")) if canonical_tag and canonical_tag.get("href") else None
        robots_tag = soup.find("meta", attrs={"name": re.compile("^robots$", re.I)})
        robots = (robots_tag.get("content") or "").lower() if robots_tag else ""
        h1s = [h.get_text(" ", strip=True) for h in soup.find_all("h1")]
        og = bool(soup.find("meta", attrs={"property": re.compile("^og:", re.I)}))
        twitter = bool(soup.find("meta", attrs={"name": re.compile("^twitter:", re.I)}))
        words = text_len(BeautifulSoup(final.text, "html.parser"))

        if not title:
            issues.append({"type": "missing_title", "url": url})
        if not desc:
            issues.append({"type": "missing_meta_description", "url": url})
        elif len(desc) > 165:
            issues.append({"type": "meta_description_too_long", "url": url, "length": len(desc)})
        if canonical != url:
            issues.append({"type": "canonical_mismatch", "url": url, "canonical": canonical})
        if "noindex" in robots:
            issues.append({"type": "unexpected_noindex", "url": url, "robots": robots})
        if len(h1s) == 0:
            issues.append({"type": "missing_h1", "url": url})
        elif len(h1s) > 1:
            issues.append({"type": "multiple_h1", "url": url, "count": len(h1s)})
        if words < 100:
            issues.append({"type": "low_word_count", "url": url, "words": words})
        if not og:
            issues.append({"type": "missing_open_graph", "url": url})
        if not twitter:
            issues.append({"type": "missing_twitter_card", "url": url})

        for a in soup.find_all("a", href=True):
            href = a.get("href", "").strip()
            if href.startswith(("mailto:", "tel:", "javascript:", "#")):
                continue
            absolute = urljoin(url, href)
            n = norm(absolute)
            if n:
                outgoing[url].add(n)
                incoming[n].add(url)
                if absolute.startswith("http://"):
                    issues.append({"type": "internal_http_link", "url": url, "target": absolute})

        rows.append({
            "url": url,
            "status": final.status_code,
            "title": title,
            "description_length": len(desc),
            "canonical": canonical,
            "robots": robots,
            "h1_count": len(h1s),
            "word_count": words,
            "open_graph": og,
            "twitter_card": twitter,
        })

    sitemap_set = set(urls)
    for url in urls:
        if url != BASE and len(incoming[url] & sitemap_set) == 0:
            issues.append({"type": "orphan_in_sitemap_graph", "url": url})
        if len(outgoing[url] & sitemap_set) == 0:
            issues.append({"type": "no_internal_outgoing_to_sitemap", "url": url})
        if len(incoming[url] & sitemap_set) == 1:
            issues.append({"type": "only_one_internal_incoming", "url": url})

    # Check internal linked targets for redirects/broken responses, capped to unique targets.
    targets = sorted({t for s in outgoing.values() for t in s})
    for target in targets:
        r = fetch(target, allow_redirects=False)
        if isinstance(r, Exception):
            issues.append({"type": "linked_target_fetch_error", "target": target, "detail": str(r)})
        elif 300 <= r.status_code < 400:
            issues.append({"type": "internal_link_to_redirect", "target": target, "status": r.status_code, "location": r.headers.get("location")})
        elif r.status_code >= 400:
            issues.append({"type": "broken_internal_link", "target": target, "status": r.status_code})

    counts = defaultdict(int)
    for i in issues:
        counts[i["type"]] += 1

    report = {
        "site": BASE,
        "sitemap_url_count": len(urls),
        "checked_pages": len(rows),
        "issue_count": len(issues),
        "issue_counts": dict(sorted(counts.items())),
        "issues": issues,
        "pages": rows,
    }

    print(json.dumps(report, indent=2, ensure_ascii=False))

    blocking = {
        "fetch_error", "sitemap_url_redirects", "non_200", "canonical_mismatch",
        "unexpected_noindex", "missing_title", "missing_meta_description", "missing_h1",
        "broken_internal_link", "internal_link_to_redirect", "internal_http_link"
    }
    blockers = [i for i in issues if i["type"] in blocking]
    print(f"\nSUMMARY: {len(urls)} sitemap URLs, {len(issues)} findings, {len(blockers)} blocking findings", file=sys.stderr)
    if blockers:
        print(json.dumps(blockers[:50], indent=2, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
