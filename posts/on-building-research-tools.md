# On building tools for other researchers

This is a sample post written in **Markdown**. To publish a new one, drop a `.md`
file in `prototype/posts/` and add an entry to `posts.json`. That's the whole workflow —
no build step, no framework.

## Why Markdown

Writing prose in HTML is miserable. In Markdown you just write:

- Lists like this one
- With **bold** and *italic*
- And [links](https://example.com)

Inline `code` and code blocks work too:

```python
import mne
raw = mne.io.read_raw_fif("sub-01_raw.fif")
raw.filter(1, 40)
```

> Block quotes render with a quiet left rule.

## How it renders

The `post.html` page reads `?slug=` from the URL, fetches the matching `.md` file,
and renders it with a tiny Markdown library loaded from a CDN. Dark mode, spacing,
and typography all come from the shared stylesheet.

That's it — get out of the way of the writing.
