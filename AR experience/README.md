# Sort It Out — Mobile Web Sorting Game

This folder contains `sortitout.html` — a mobile-first, vanilla-JS sorting game (swipe-to-catapult mechanics) intended for later AR integration.

Quick start (local):
- Open `sortitout.html` in a mobile browser or desktop for testing.

How to add to a GitHub repo and publish on GitHub Pages

1) If this folder is not yet a git repo (run in this project folder):

```bash
git init
git add .
git commit -m "Add Sort It Out web game"
# Create a repo on GitHub (manually or via gh/GUI) and add remote:
# git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
# Push to main (or create gh-pages branch for Pages):
# git push -u origin main
```

2) Publish with GitHub Pages:
- Option A (docs folder): move `sortitout.html` into a `docs/` folder, then enable GitHub Pages from repository settings (use `main/docs`).
- Option B (gh-pages branch): create a `gh-pages` branch and push the site root there.

3) Link from your website:
- Add a link to your site: `<a href="/sortitout.html">Sort It Out</a>` (or the path where you host it on Pages).

Notes
- The game is optimized for mobile portrait and uses pointer events. Test on Safari/Chrome mobile.
- No external frameworks or build steps required.

Next steps for AR
- See `AR_PLACEHOLDER.md` for suggested approaches (WebXR / 8th Wall / model placement) and minimal changes needed to make the game AR-enabled.

If you'd like, I can create a Git branch, commit these files, and attempt to push — but I need your repo URL and permission (or you can run the commands above).