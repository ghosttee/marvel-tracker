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

Run this SQL in your Supabase SQL editor once. The composite `(user_id, id)` primary key
scopes rows to each signed-in account, and the RLS policy stops one user from reading or
writing another user's watch history.

```sql
create table if not exists marvel_tracker (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  watched boolean default false,
  rating int,
  primary key (user_id, id)
);

alter table marvel_tracker enable row level security;

create policy "users access own rows"
  on marvel_tracker
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### Migrating from the older schema

If you originally set the table up with just `id text primary key, watched, rating`, run
this migration once. Replace `<your-auth-uid>` with the UUID of the account that owns the
existing rows (find it in **Authentication → Users**).

```sql
alter table marvel_tracker add column if not exists user_id uuid;
update marvel_tracker set user_id = '<your-auth-uid>' where user_id is null;
alter table marvel_tracker alter column user_id set not null;
alter table marvel_tracker drop constraint marvel_tracker_pkey;
alter table marvel_tracker add primary key (user_id, id);
alter table marvel_tracker
  add constraint marvel_tracker_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table marvel_tracker enable row level security;
create policy "users access own rows"
  on marvel_tracker for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## Without Supabase
The app works fine without Supabase — progress just won't be saved across sessions.
Simply skip the environment variables and deploy.
