// Writing index: render the post list from posts/posts.json, newest first.

fetch("posts/posts.json", { cache: "no-cache" })
  .then(r => r.json())
  .then(posts => {
    posts.sort((a, b) => b.date.localeCompare(a.date));
    document.getElementById("list").innerHTML = posts.map(p =>
      '<li><a href="post.html?slug=' + p.slug + '">' +
        '<span><span class="title">' + p.title + '</span>' +
        '<span class="desc">' + (p.desc || "") + '</span></span>' +
        '<span class="date">' + p.date + '</span>' +
      '</a></li>'
    ).join("");
  })
  .catch(() => {
    document.getElementById("list").innerHTML =
      "<li style='padding:1rem 0;color:var(--muted)'>No posts yet.</li>";
  });
