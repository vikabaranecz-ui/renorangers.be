# Reno Rangers — Website

Renovatiebedrijf Antwerpen | Totaalrenovatie, Badkamerrenovatie & Binnenafwerking

**Tech stack:** Vite + React  
**Deployment:** Vercel via GitHub

---

## 🚀 DEPLOYMENT: Step-by-Step Guide

### Step 1: Install Prerequisites

Make sure you have these installed on your computer:

- **Node.js** (v18+): https://nodejs.org
- **Git**: https://git-scm.com
- **GitHub account**: https://github.com
- **Vercel account**: https://vercel.com (sign up with GitHub)

---

### Step 2: Prepare the Project Locally

```bash
# 1. Unzip the project (if downloaded as zip)
# 2. Open terminal and navigate to the project folder:
cd renorangers-site

# 3. Install dependencies:
npm install

# 4. Test locally:
npm run dev
# → Open http://localhost:5173 in your browser
```

---

### Step 3: Push to GitHub

```bash
# 1. Create a new repository on github.com:
#    → Go to https://github.com/new
#    → Name: renorangers-website
#    → Private (recommended)
#    → Do NOT add README (we already have one)
#    → Click "Create repository"

# 2. In your terminal, inside the project folder:
git init
git add .
git commit -m "Initial commit: Reno Rangers website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/renorangers-website.git
git push -u origin main
```

---

### Step 4: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your **renorangers-website** repository
4. Vercel auto-detects Vite — settings should be:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**
6. Wait ~60 seconds — your site is live!

---

### Step 5: Connect Custom Domain (renorangers.be)

1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add: `www.renorangers.be` and `renorangers.be`
3. Vercel shows DNS records to add
4. Go to your domain registrar (One.com) and update DNS:
   - **A record:** `@` → `76.76.21.21`
   - **CNAME record:** `www` → `cname.vercel-dns.com`
5. Wait 5-30 minutes for DNS propagation
6. Vercel auto-generates SSL certificate

---

## 📁 Project Structure

```
renorangers-site/
├── index.html          ← Main HTML with SEO meta tags + Schema markup
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── vercel.json         ← Vercel deployment config + security headers
├── .gitignore          ← Git ignore rules
├── public/
│   └── favicon.svg     ← Browser tab icon
└── src/
    ├── main.jsx        ← React entry point
    └── App.jsx         ← Full website (all 6 pages)
```

---

## 🖼️ Replacing Placeholder Images

The site currently uses Unsplash stock photos. Replace them with real Reno Rangers project photos:

1. Open `src/App.jsx`
2. Find the `IMG` object at the top (line ~4)
3. Replace each URL with your own image URL

**Recommended:** Upload your images to Vercel Blob or Cloudinary, then paste the URLs.

**Image naming guide:**
| Key | What it shows | Recommended photo |
|---|---|---|
| `hero` | Homepage background | Best completed project, wide angle |
| `bath1` | Bathroom service | Completed bathroom, modern |
| `bath2` | Bathroom detail | Bathroom detail or before/after |
| `kitchen1` | Kitchen | Completed kitchen renovation |
| `living1` | Living room | Completed living room |
| `interior1` | Interior finishing | Painted walls, smooth finish |
| `floor1` | Flooring | Tile or floor work |
| `team1` | Team at work | Workers on site |
| `team2` | Team portrait | Team or professional photo |
| `proj1` | Project card | Completed apartment |
| `proj2` | Project card | Another project |

---

## 🔄 Making Changes

```bash
# 1. Edit files in src/App.jsx
# 2. Test locally:
npm run dev

# 3. Push to GitHub (auto-deploys to Vercel):
git add .
git commit -m "Updated content"
git push
```

Vercel automatically rebuilds and deploys on every push to `main`.

---

## 📊 SEO Features Included

- ✅ Meta title & description (Dutch)
- ✅ Open Graph tags (Facebook/LinkedIn sharing)
- ✅ Twitter Card tags
- ✅ JSON-LD Schema markup (HomeAndConstructionBusiness)
- ✅ All 18 service areas listed in schema
- ✅ Opening hours in schema
- ✅ Aggregate rating (5.0, 12 reviews)
- ✅ Services listed as structured offers
- ✅ Canonical URL
- ✅ Geo meta tags for Antwerpen
- ✅ Semantic HTML structure
- ✅ Preconnect for Google Fonts (faster load)

---

## 📞 Contact Details in the Site

- Phone: +32 465 88 39 19
- Email: info@renorangers.be
- WhatsApp: wa.me/32465883919
- Location: Antwerpen, België

All links are fully connected and clickable.
