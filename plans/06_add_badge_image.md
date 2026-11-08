# Add Badge.png: new branch + pull request

## Context
You added `public/images/Badge.png` (391×232, 113 KB) and want it to go through its own branch and PR into `portfolio_app`.

Current state:
- The last PR (#1, "Add showcase screenshots") is merged. Your local `portfolio_app` is 1 commit behind GitHub, which is just the merge commit, so a `git pull` fast-forwards it with no conflicts.
- `Badge.png` is untracked, and `PROMPTS.md` has uncommitted log entries. Both carry over to the new branch.
- On the live site, the Showcase comes from the admin page (Firestore). The award entry **"Recognition"** has no images yet, so after deploying you still need to add `/images/Badge.png` to it on the admin page. No code changes are needed.

## Steps (I'll do these)
1. Log the prompt in `PROMPTS.md`; save this plan as `plans/06_add_badge_image.md`.
2. `git checkout portfolio_app && git pull` to catch up to GitHub.
3. `git checkout -b add_badge_image`
4. Check that `git branch --show-current` shows `add_badge_image` and that `git status` lists `Badge.png`.

## You run (project rules: you commit, push and open PRs)
```bash
git branch --show-current   # must say add_badge_image
git add .
git commit -m "Add badge image for Recognition award"
git push -u origin add_badge_image
gh pr create --base portfolio_app --head add_badge_image \
  --title "Add badge image" --body "Adds Badge.png for the Recognition award on the Showcase page."
```
Merge the PR on GitHub, and wait for Cloud Build to finish.

Then open the admin page → Showcase → **Recognition**, add `/images/Badge.png` to its images, and save.

Finally, back on your machine: `git checkout portfolio_app && git pull`.

## Verification
- `https://personal-portfolio-143312829237.us-west1.run.app/images/Badge.png` returns the image (it's 404 before the deploy).
- The Showcase page shows the badge on the Recognition card.
