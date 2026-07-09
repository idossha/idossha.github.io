// Single post: fetch the Markdown named by ?slug= and render it with marked.

(async function () {
  const params = new URLSearchParams(location.search);
  const slug = (params.get("slug") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const el = document.getElementById("post");
  if (!slug) { el.innerHTML = "<p class='lead'>Post not found.</p>"; return; }

  try {
    const [meta, md] = await Promise.all([
      fetch("posts/posts.json").then(r => r.json()),
      fetch("posts/" + slug + ".md").then(r => { if (!r.ok) throw 0; return r.text(); })
    ]);
    const info = meta.find(p => p.slug === slug) || {};
    const html = marked.parse(md);
    // Pull the first <h1> out of the rendered body and pair it with the date.
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const h1 = tmp.querySelector("h1");
    const title = h1 ? h1.outerHTML : "";
    if (h1) h1.remove();
    el.innerHTML =
      title +
      (info.date ? '<div class="meta">' + info.date + "</div>" : "") +
      tmp.innerHTML;
    if (info.title) document.title = info.title + " · Ido Haber";
  } catch (e) {
    el.innerHTML = "<p class='lead'>Couldn't load this post.</p>";
  }
})();
