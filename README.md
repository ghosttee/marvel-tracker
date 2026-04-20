# Marvel Watch Tracker

Track all MCU films before Avengers: Doomsday, with movie posters and Supabase sync.

## Deploy to Vercel (2 minutes)

### 1. Install & run locally first (optional)
```bash
npm install
npm run dev
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Marvel tracker"
git remote add origin https://github.com/YOUR_USERNAME/marvel-tracker.git
git push -u origin main
```

### 3. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import your repo
3. Add these environment variables:
   - `VITE_SUPABASE_URL` → your Supabase project URL (e.g. `https://xxxx.supabase.co`)
   - `VITE_SUPABASE_KEY` → your Supabase anon public key
4. Click **Deploy**

That's it — Vercel auto-detects Vite and builds it for you.

## Supabase setup

Run this SQL in your Supabase SQL editor once:
```sql
CREATE TABLE IF NOT EXISTS marvel_tracker (
  id TEXT PRIMARY KEY,
  watched BOOLEAN DEFAULT false,
  rating INT
);
```

## Without Supabase
The app works fine without Supabase — progress just won't be saved across sessions.
Simply skip the environment variables and deploy.
