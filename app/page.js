"use client";

import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const PAGE_SIZE = 50;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [field, setField] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/posts.json")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = !q ? [...posts] : posts.filter((p) => {
      if (field === "id") return p.id.toLowerCase().includes(q);
      if (field === "title") return p.title.toLowerCase().includes(q);
      if (field === "username") return p.username.toLowerCase().includes(q);
      if (field === "userId") return p.userId.toLowerCase().includes(q);
      return (
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.userId.toLowerCase().includes(q)
      );
    });

    filtered.sort((a, b) => {
      const aId = Number(a.id);
      const bId = Number(b.id);
      return sortOrder === "asc" ? aId - bId : bId - aId;
    });

    return filtered;
  }, [posts, query, field, sortOrder]);

  useEffect(() => setPage(1), [query, field, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main className="shell">
      <header>
        <h1>deeeep.io Forum Search</h1>
        <p>Search the English forum archive.</p>
      </header>

      <section className="searchBox">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          aria-label="Search posts"
        />
        <select value={field} onChange={(e) => setField(e.target.value)} aria-label="Search field">
          <option value="all">All fields</option>
          <option value="title">Title</option>
          <option value="username">Username</option>
          <option value="userId">User ID</option>
          <option value="id">Post ID</option>
        </select>
      </section>

      <div className="toolbar">
        <div className="summary">
          {loading ? "Loading database..." : `${results.length.toLocaleString()} matching posts`}
          {!loading && query && ` for “${query}”`}
        </div>
        <label className="sortControl">
          Sort by Post ID:
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} aria-label="Sort by Post ID">
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </label>
      </div>

      <section className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Title</th>
              <th>Username</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.id}>
                <td>
                  <a href={`https://deeeep.io/forum/en/${encodeURIComponent(p.id)}`} target="_blank" rel="noreferrer">
                    {p.id}
                  </a>
                </td>
                <td>{p.title || <span className="muted">No title</span>}</td>
                <td>{p.username || <span className="muted">Unknown</span>}</td>
                <td>{p.userId || <span className="muted">Unknown</span>}</td>
              </tr>
            ))}
            {!loading && visible.length === 0 && (
              <tr><td colSpan="4" className="empty">No posts found.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <nav className="pager" aria-label="Pagination">
        <button disabled={safePage <= 1} onClick={() => setPage(1)}>First</button>
        <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>← Previous</button>
        <span>Page {safePage.toLocaleString()} of {pageCount.toLocaleString()}</span>
        <div className="pageJump">
          <input
            type="number"
            min="1"
            max={pageCount}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const requested = Number.parseInt(pageInput, 10);
                if (Number.isFinite(requested)) {
                  setPage(Math.min(Math.max(requested, 1), pageCount));
                  setPageInput("");
                }
              }
            }}
            placeholder="Page"
            aria-label="Page number"
          />
          <button onClick={() => {
            const requested = Number.parseInt(pageInput, 10);
            if (Number.isFinite(requested)) {
              setPage(Math.min(Math.max(requested, 1), pageCount));
              setPageInput("");
            }
          }}>Go</button>
        </div>
        <button disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>Next →</button>
        <button disabled={safePage >= pageCount} onClick={() => setPage(pageCount)}>Last</button>
      </nav>

      <footer>
        {posts.length.toLocaleString()} posts in database
      </footer>
    </main>
  );
}
