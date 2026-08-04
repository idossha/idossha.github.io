// Home page: master–detail layout. Project panels render Markdown from
// projects/, the music panel embeds music-embed.html in an iframe.

const detail       = document.getElementById("detail");
const detailScroll = document.getElementById("detailScroll");
const closeBtn     = document.getElementById("detailClose");
const body         = document.getElementById("detailBody");
let projectMeta = [];
let lastTrigger = null;   // element to restore focus to when the panel closes

// Fade-edge scroll: fade whichever edge (top/bottom) has more content beyond it
const FADE = "4rem";   // fade depth
function updateFade(el) {
  const max = el.scrollHeight - el.clientHeight;
  el.style.setProperty("--fade-top", el.scrollTop > 4 ? FADE : "0px");
  el.style.setProperty("--fade-bottom", (max - el.scrollTop) > 4 ? FADE : "0px");
}
function attachFade(el) {
  if (!el) return () => {};
  el.classList.add("fade-scroll");
  const u = () => updateFade(el);
  el.addEventListener("scroll", u, { passive: true });
  el.addEventListener("load", u, true);   // a descendant img/iframe loaded → height changed
  window.addEventListener("resize", u);
  requestAnimationFrame(u);
  return u;
}
const detailFade = attachFade(detailScroll);
const workList = document.getElementById("work");
attachFade(workList);

// Load project metadata once, then render the "Selected work" list from it.
// External entries (with an `href`) open in a new tab; the rest open in-panel.
function loadProjectMeta() {
  if (projectMeta.length) return Promise.resolve(projectMeta);
  return fetch("projects/projects.json", { cache: "no-cache" })
    .then(r => r.json())
    .then(data => { projectMeta = data; return data; });
}

function renderWorkList(projects) {
  workList.innerHTML = projects.map(p => {
    const ext = p.href
      ? ' <i class="fa-solid fa-arrow-up-right-from-square ext"></i>'
      : "";
    const attrs = p.href
      ? 'href="' + p.href + '" target="_blank" rel="noopener"'
      : 'href="?project=' + p.slug + '" data-project="' + p.slug + '"';
    return '<li><a ' + attrs + '>' +
      '<span>' +
        '<span class="titlerow"><span class="title">' + p.title + ext +
          '</span><span class="tag">' + (p.tag || "") + '</span></span>' +
        '<span class="desc">' + (p.desc || "") + '</span>' +
      '</span></a></li>';
  }).join("");
}

loadProjectMeta().then(renderWorkList).catch(() => {});

// Don't let the browser restore a stale scroll position on deep-link/reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
function resetScroll() {
  detailScroll.scrollTop = 0;
  requestAnimationFrame(() => { detailScroll.scrollTop = 0; detailFade(); });
}

// Open the panel shell (always visible before content loads) and move focus in
function showPanel(trigger) {
  if (trigger) lastTrigger = trigger;
  document.body.classList.add("detail-open");
  detail.setAttribute("aria-hidden", "false");
  resetScroll();
  requestAnimationFrame(() => closeBtn.focus({ preventScroll: true }));
}

async function openProject(slug, trigger) {
  slug = String(slug).toLowerCase().replace(/[^a-z0-9-]/g, "");
  showPanel(trigger);
  body.innerHTML = '<p class="lead">Loading…</p>';
  history.replaceState(null, "", "?project=" + slug);
  try {
    if (!projectMeta.length) {
      projectMeta = await fetch("projects/projects.json").then(r => r.json());
    }
    const info = projectMeta.find(p => p.slug === slug) || {};
    const md = await fetch("projects/" + slug + ".md").then(r => {
      if (!r.ok) throw 0; return r.text();
    });
    const tmp = document.createElement("div");
    tmp.innerHTML = marked.parse(md);
    const h1 = tmp.querySelector("h1");
    const title = h1 ? h1.outerHTML : "";
    if (h1) h1.remove();
    body.innerHTML =
      title +
      (info.tag ? '<div class="meta">' + info.tag + "</div>" : "") +
      tmp.innerHTML;
    resetScroll();
  } catch (e) {
    body.innerHTML = "<p class='lead'>Couldn’t load this project.</p>";
  }
}

function openMusic(trigger) {
  showPanel(trigger);
  body.innerHTML =
    '<h1 style="margin-bottom:0.5rem">Music</h1>' +
    '<div class="meta">A few tracks I keep coming back to.</div>' +
    '<iframe class="panel-embed" src="music-embed.html" title="Music player"></iframe>';
  history.replaceState(null, "", "?panel=music");
  requestAnimationFrame(detailFade);
}

function closeProject() {
  if (!document.body.classList.contains("detail-open")) return;
  document.body.classList.remove("detail-open");
  detail.setAttribute("aria-hidden", "true");
  body.innerHTML = "";      // stop any playing media (music iframe) + drop stale focusables
  history.replaceState(null, "", location.pathname);
  if (lastTrigger) { lastTrigger.focus({ preventScroll: true }); lastTrigger = null; }
}

document.getElementById("work").addEventListener("click", e => {
  const a = e.target.closest("a[data-project]");
  if (!a) return;
  e.preventDefault();
  openProject(a.dataset.project, a);
});

document.querySelector(".icons").addEventListener("click", e => {
  const a = e.target.closest('a[data-panel="music"]');
  if (!a) return;
  e.preventDefault();
  openMusic(a);
});
closeBtn.addEventListener("click", closeProject);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeProject(); });

// Deep links on load
const params = new URLSearchParams(location.search);
if (params.get("project")) openProject(params.get("project"));
else if (params.get("panel") === "music") openMusic();
