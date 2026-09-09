#!/usr/bin/env python3
import json, os
from datetime import date, timedelta
from urllib.parse import quote
import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

site = os.getenv('GSC_SITE_URL', 'sc-domain:renorangers.be').strip()
raw = os.getenv('GOOGLE_ADC_JSON', '').strip()
if not raw:
    raise SystemExit('GOOGLE_ADC_JSON missing')
info = json.loads(raw)
creds = service_account.Credentials.from_service_account_info(
    info,
    scopes=['https://www.googleapis.com/auth/webmasters.readonly'],
)
creds.refresh(Request())
headers = {'Authorization': f'Bearer {creds.token}', 'Content-Type': 'application/json'}
end = date.today() - timedelta(days=1)
start = end - timedelta(days=27)
url = 'https://www.googleapis.com/webmasters/v3/sites/' + quote(site, safe='') + '/searchAnalytics/query'
body = {'startDate': start.isoformat(), 'endDate': end.isoformat(), 'dimensions': ['query'], 'rowLimit': 10}
r = requests.post(url, headers=headers, json=body, timeout=60)
if r.status_code >= 400:
    raise SystemExit(f'GSC CHECK FAILED HTTP {r.status_code}: {r.text[:1000]}')
data = r.json()
rows = data.get('rows', [])
print('GSC CHECK OK')
print('site:', site)
print('service_account:', info.get('client_email', 'unknown'))
print('period:', start.isoformat(), 'to', end.isoformat())
print('sample_rows:', len(rows))
for row in rows[:10]:
    q = (row.get('keys') or [''])[0]
    print(f"- {q} | clicks={row.get('clicks',0)} impressions={row.get('impressions',0)} position={row.get('position',0)}")
