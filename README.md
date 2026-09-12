# deeeep.io Forum Search

A simple Next.js search app built from `forum_posts.csv`.

## What it does

- Searches Post ID, Title, and Username
- Lets users choose which field to search
- Shows 50 results per page
- Links each Post ID to the original deeeep.io forum post
- Each visitor's search/filter state is independent because it runs in their own browser

## Run locally

1. Install Node.js.
2. Open a terminal in this folder.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local address printed by Next.js.

## Deploy to Vercel

Upload this project to a GitHub repository, then import that repository into Vercel. No database is required for this first version because the searchable archive is stored in `public/posts.json`.

## Updating the database

Replace `public/posts.json` with a newly generated JSON file whenever `forum_posts.csv` changes, then redeploy.

The original CSV included a `User ID` column, but the first app version intentionally does not publish that column.
