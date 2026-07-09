# idossha.github.io

Personal site of Ido Haber, served by GitHub Pages. Plain HTML/CSS/JS — no build step.

## Structure

```
index.html          Home: intro + selected work (in-page project panels)
blog.html           Writing index (rendered from posts/posts.json)
post.html           Single post (renders posts/<slug>.md via ?slug=)
cv.html             CV (renders assets/projects/cv/resume.md)
photos.html         B&W photo gallery with lightbox
records.html        Vinyl collection grid with search
music-embed.html    Music player widget (embedded in the home page panel)

css/                One stylesheet per page family
  style.css           Site theme (home, writing, post, CV)
  photos.css          Photo gallery
  records.css         Records grid
  music-embed.css     Music player widget
js/                 One script per page
  home.js, blog.js, post.js, cv.js
  photos.js, records.js, records-search.js, music-player.js
data/
  photo-dims.json     Image dimensions for the gallery (prevents layout shift)
posts/              Blog posts (Markdown + posts.json index)
projects/           Project write-ups (Markdown + projects.json index)
assets/             Images, audio, PDFs, and other media
tools/              Dev scripts (not served)
  generate_photo_dims.py     Regenerate data/photo-dims.json from photos.html
  download_discogs_images.py Fetch record cover art from Discogs
```

## Conventions

- Markdown content is rendered client-side with [marked](https://github.com/markedjs/marked).
- Asset URLs are root-relative (`/assets/...`); page URLs are relative.
- After adding photos to `assets/photos/` and `photos.html`, run
  `python3 tools/generate_photo_dims.py`.
