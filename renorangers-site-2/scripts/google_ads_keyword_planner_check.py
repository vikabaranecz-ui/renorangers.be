#!/usr/bin/env python3
import json, os, sys
import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

API_VERSION = os.getenv('GOOGLE_ADS_API_VERSION','v25')
DEV_TOKEN = os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN','').strip()
ADC = os.getenv('GOOGLE_ADC_JSON','').strip()
LOGIN_CUSTOMER = os.getenv('GOOGLE_ADS_LOGIN_CUSTOMER_ID','').replace('-','').strip()
LANGUAGE='languageConstants/1010'
BELGIUM='geoTargetConstants/2056'
SEEDS=[
 'renovatie','renovatiebedrijf','renovatie aannemer','totaalrenovatie','badkamerrenovatie',
 'binnenafwerking','aannemer renovatie','appartement renoveren','woning renoveren',
 'investeringspand renoveren','renovatie voor verhuur','renovatie voor verkoop',
 'aannemer voor architecten','bouwpartner architect','aannemer interieurarchitect'
]

def fail(msg):
 print(msg); sys.exit(1)

if not ADC: fail('GOOGLE_ADC_JSON missing')
if not DEV_TOKEN: fail('GOOGLE_ADS_DEVELOPER_TOKEN missing')
try: info=json.loads(ADC)
except Exception as e: fail(f'Invalid GOOGLE_ADC_JSON: {e}')
creds=service_account.Credentials.from_service_account_info(info, scopes=['https://www.googleapis.com/auth/adwords'])
creds.refresh(Request())
headers={'Authorization':f'Bearer {creds.token}','developer-token':DEV_TOKEN,'Content-Type':'application/json'}
if LOGIN_CUSTOMER: headers['login-customer-id']=LOGIN_CUSTOMER

r=requests.get(f'https://googleads.googleapis.com/{API_VERSION}/customers:listAccessibleCustomers',headers=headers,timeout=60)
if r.status_code>=400: fail(f'listAccessibleCustomers HTTP {r.status_code}: {r.text[:1200]}')
resources=r.json().get('resourceNames',[])
if not resources: fail('No Google Ads customers accessible to this service account')
print('Accessible Google Ads customers:', ', '.join(resources))

# Try Keyword Planner on each directly accessible customer and keep successful ones.
success=[]
for resource in resources:
 cid=resource.split('/')[-1]
 url=f'https://googleads.googleapis.com/{API_VERSION}/customers/{cid}:generateKeywordIdeas'
 body={'language':LANGUAGE,'geoTargetConstants':[BELGIUM],'includeAdultKeywords':False,'keywordPlanNetwork':'GOOGLE_SEARCH','keywordSeed':{'keywords':SEEDS}}
 rr=requests.post(url,headers=headers,json=body,timeout=60)
 if rr.status_code<400:
  results=rr.json().get('results',[])
  success.append((cid,len(results),results))
  print(f'Keyword Planner OK customer={cid} Belgium ideas={len(results)}')
 else:
  print(f'Keyword Planner unavailable customer={cid}: HTTP {rr.status_code} {rr.text[:500]}')

if not success: fail('No accessible Google Ads customer could return Keyword Planner ideas')

# Antwerp Province lookup through the first successful customer.
cid=success[0][0]
q="SELECT geo_target_constant.resource_name, geo_target_constant.name, geo_target_constant.canonical_name, geo_target_constant.country_code, geo_target_constant.target_type, geo_target_constant.status FROM geo_target_constant WHERE geo_target_constant.name = 'Antwerp' AND geo_target_constant.country_code = 'BE'"
rr=requests.post(f'https://googleads.googleapis.com/{API_VERSION}/customers/{cid}/googleAds:search',headers=headers,json={'query':q},timeout=60)
if rr.status_code>=400: fail(f'Antwerp geo lookup failed: HTTP {rr.status_code}: {rr.text[:800]}')
candidates=[]
for row in rr.json().get('results',[]):
 g=row.get('geoTargetConstant',{})
 if str(g.get('targetType','')).lower()=='province' and g.get('status') in (None,'','ENABLED'):
  candidates.append(g)
if not candidates: fail('Could not resolve enabled Antwerp Province geo target')
local_resource=candidates[0].get('resourceName')
body={'language':LANGUAGE,'geoTargetConstants':[local_resource],'includeAdultKeywords':False,'keywordPlanNetwork':'GOOGLE_SEARCH','keywordSeed':{'keywords':SEEDS}}
rr=requests.post(f'https://googleads.googleapis.com/{API_VERSION}/customers/{cid}:generateKeywordIdeas',headers=headers,json=body,timeout=60)
if rr.status_code>=400: fail(f'Antwerp Keyword Planner failed: HTTP {rr.status_code}: {rr.text[:900]}')
ideas=rr.json().get('results',[])
print(f'Antwerp Keyword Planner OK customer={cid} ideas={len(ideas)} geo={candidates[0].get("canonicalName") or candidates[0].get("name")}')
for item in ideas[:25]:
 m=item.get('keywordIdeaMetrics',{}) or {}
 print(f"- {item.get('text')} | monthly={m.get('avgMonthlySearches',0)} | paid_competition={m.get('competition')}")
