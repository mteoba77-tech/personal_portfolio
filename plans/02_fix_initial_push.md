# Fix the failed initial commit and push

## Context
The commands ran from `~` (prompt showed `mteoba@MSI:~$`), not from the project folder. Your home folder `/home/mteoba` is a git repo too, probably created by accident. It has 2 commits ("Add project rules for Claude Code" and "Initial portfolio app") and the same `origin` remote. So `git add .` tried to stage your whole home folder (.nvm, other projects…), failed, and the commit only recorded removing CLAUDE.md from that home repo. The push failed because no `portfolio_app` branch exists.

The real project repo at `~/projects/personal_potfolio` is fine. It has no commits yet, it's on `main`, and `origin` already points to GitHub. Your files are all still on disk; nothing was lost.

## Steps
1. **Log the prompt** in `PROMPTS.md` with a timestamp, and save this plan to `plans/` with the next number (project rules).
2. **Turn off the accidental home repo** without deleting anything: `mv ~/.git ~/.git_accidental_backup`. Git will then stop treating `~` as a repo. Once you're sure you don't need it, you can delete the backup.
3. **Create the branch in the project repo** (rule: never commit to main):
   `cd ~/projects/personal_potfolio && git checkout -b portfolio_app`
4. **Check what would be committed**: run `git status`. `node_modules/`, `.next/` and `.env` are already gitignored. Also check that no secrets are in the files being added.

## Commands for you to run (I won't commit or push)
```bash
cd ~/projects/personal_potfolio
git add .
git commit -m "Initial portfolio app"
git push -u origin portfolio_app
```
`origin` already exists here, so skip `git remote add`.

## Verification
- `cd ~ && git status` should say "not a git repository".
- In the project: `git branch` shows `* portfolio_app`, and `git status` lists only project files.
- After the push, the `portfolio_app` branch shows up at github.com/mteoba77-tech/personal_portfolio.
