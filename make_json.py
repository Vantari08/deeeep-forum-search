import csv, json
from pathlib import Path

src = Path("forum_posts.csv")
dst = Path("public/posts.json")

with src.open("r", encoding="utf-8-sig", newline="") as f:
    rows = csv.DictReader(f)
    posts = [
        {
            "id": (r.get("Post ID") or "").strip(),
            "title": (r.get("Title") or "").strip(),
            "username": (r.get("Username") or "").strip(),
            "userId": (r.get("User ID") or "").strip(),
        }
        for r in rows
    ]

dst.write_text(json.dumps(posts, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"Wrote {len(posts):,} posts to {dst}")
