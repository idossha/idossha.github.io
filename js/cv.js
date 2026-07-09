// CV page: render the Markdown resume with marked (PDF link is the fallback).

(async function () {
  const el = document.getElementById("resume");
  try {
    marked.setOptions({ breaks: true });
    const md = await fetch("/assets/projects/cv/resume.md").then(r => {
      if (!r.ok) throw 0; return r.text();
    });
    el.innerHTML = marked.parse(md);
  } catch (e) {
    el.innerHTML = '<p class="lead">Couldn’t load the CV. ' +
      '<a href="/assets/projects/cv/resume_July2026.pdf">Open the PDF instead.</a></p>';
  }
})();
