# kelvin's profile site

A single-page profile website. **Zero frameworks, zero build step, zero accounts** —
just `index.html`, `style.css`, and `script.js`, served straight by GitHub Pages.

## 📄 Updating your resume

Drop a PDF named **`resume.pdf`** into the repo root and push:

```bash
cp ~/Downloads/my-new-resume.pdf resume.pdf
git add resume.pdf
git commit -m "update resume"
git push
```

That's it. The site auto-detects the file — the Resume section shows an embedded
viewer plus a download button. If `resume.pdf` is missing, it shows a
"coming soon" placeholder instead. No config to edit.

## ✏️ Editing content

Everything lives in `index.html` — bio, skills cards, contact links.
The terminal animation lines are at the top of `script.js` (`TERMINAL_SCRIPT`).
Colors live in the `:root` block at the top of `style.css`.

## 🖥️ Previewing locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly also works, but the resume auto-detection needs a
server since browsers block `fetch` on `file://`.)

## 🥚 Easter eggs

- Hover the big name on the hero
- Konami code: ↑ ↑ ↓ ↓ ← → ← → B A (or tap the hint in the footer on mobile)
- Open the browser console
- Switch to another tab and look at the title
