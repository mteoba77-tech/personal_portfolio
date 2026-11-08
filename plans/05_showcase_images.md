# Showcase pictures: branch + pull request

## Context
You added 3 screenshots to `public/images/`: `HelloAPI.png`, `Personal Profile App.png` and `PicViz.jpg`. You're on `portfolio_app` and they aren't committed yet.

On the live site, the Showcase content comes from Firestore (saved from the admin page), and it already points to these exact paths:
- Personal Portfolio → `/images/Personal Profile App.png`
- Hello API → `/images/HelloAPI.png`
- PicViz Project → `/images/PicViz.jpg`

So no code or content changes are needed. The pictures show up once these files are deployed. The sizes are fine (37–340 KB).

## Steps
1. Log the prompt in `PROMPTS.md`; save this plan as `plans/05_showcase_images.md`.
2. Create the branch `add_showcase_images` from `portfolio_app`. The uncommitted images come with it. (I'll do this.)
3. Check that `PicViz.jpg` has no location data in it. Strip it if it does.
4. Leave the file names as they are. `Personal Profile App.png` has spaces, but it works, and renaming it would break the path saved on the admin page.

## You run (per project rules, I don't commit, push or open PRs)
```bash
git add .
git commit -m "Add showcase screenshots"
git push -u origin add_showcase_images
gh pr create --base portfolio_app --head add_showcase_images \
  --title "Add showcase screenshots" --body "Adds screenshots for Personal Portfolio, Hello API and PicViz."
```
Then merge the PR on GitHub. Merging into `portfolio_app` starts the Cloud Build deploy.

## Verification
- `git branch` shows `* add_showcase_images`, and `git status` lists the 3 images.
- After you merge: Cloud Build → History shows a green build, and the Showcase page on the live site shows the 3 pictures.
