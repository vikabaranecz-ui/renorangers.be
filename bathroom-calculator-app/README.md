# Bathroom Renovation Calculator

Standalone internal bathroom inspection and pricing calculator.

## Deployment

Deploy this folder as its own Vercel project and set **Root Directory** to `bathroom-calculator-app`.

## Data

The app currently uses the existing Supabase project because the account has reached the active free-project limit. Calculator data is isolated in `bathroom_estimates` and `bathroom_pricing_profiles`, both protected by RLS.

This project is not part of the public Reno Rangers website build.
