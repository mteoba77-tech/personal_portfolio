# Plan: Personal Portfolio (Next.js, Caterpillar yellow/black, Cloud Run)

## Context
Empty project folder (`personal_potfolio/`, only `CLAUDE.md`). Goal: a multi-page, responsive, dynamic portfolio that deploys to Google Cloud Run from GitHub, reads `PORT` from the environment, has a CAT yellow/black theme, content editable both as files in VS Code and through a password-protected in-app admin page, plus a contact form that stores and emails messages.

Decisions already made with the user:
- **Stack: Next.js** (example stack) instead of Python/Poetry — this overrides the Poetry rule in `CLAUDE.md` for this project.
- **Storage: Firestore** for admin edits + contact messages (Cloud Run disk is ephemeral).
- **Contact: store + email** via SMTP.
- **Git: leave repo as is** (root is `/home/mteoba`); just work on a non-`main` branch.

## Setup
1. Log this prompt in `PROMPTS.md` (timestamped) — first action.
2. `git checkout -b portfolio_app` (underscores, not `main`). No commits/pushes.
3. Save this plan as `plans/01_portfolio_app.md`.
4. Node is not installed → install Node 22 LTS user-level via `nvm` (no sudo).

## Stack
Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · lucide-react · framer-motion · `@google-cloud/firestore` · `nodemailer`. Nothing else (auth uses built-in Web Crypto; validation is hand-written).

## Structure
```
content/                 ← edit these in VS Code
  profile.json           name, title, photo, bio, linkedin, email, work[], education[]
  projects.json          [{id, type: project|award, title, description, tech[], links[{label,url}], images[]}]  (3 starter entries)
  skills.json            technical[{name, level 1-5, category}], tools{known[], learning[]}
public/images/           profile.jpg + project screenshots
src/app/
  layout.tsx             header/nav + footer, theme
  page.tsx               Home
  showcase/page.tsx      Projects & awards
  skills/page.tsx        Skills
  contact/page.tsx       Contact form (server action)
  admin/login/page.tsx   Login
  admin/page.tsx         Edit profile / projects / skills (JSON-backed forms)
  admin/messages/page.tsx  Read contact submissions
src/components/          Nav (mobile hamburger drawer), PageCard, ProjectCard, ImageGallery, SkillBar, Timeline, ...
src/lib/
  content.ts             getProfile/getProjects/getSkills: Firestore doc if present, else content/*.json; save* writes Firestore
  firestore.ts           lazy client; disabled when USE_FIRESTORE != "true" (local dev uses JSON only)
  auth.ts                HMAC-signed session cookie (Web Crypto), password check vs ADMIN_PASSWORD
  mail.ts                nodemailer SMTP send
src/middleware.ts        protects /admin/* except /admin/login
Dockerfile, .dockerignore, .gitignore, .env.example (names only, no values)
requirements.txt, README.md
```

## Pages
- **Home**: hero with photo, name, job title, short bio; LinkedIn button; `mailto:mteoba77@yahoo.com` button; work & education timeline; big clickable panels linking to Showcase, Skills, Contact. Bold yellow/black design, diagonal "hazard stripe" accents, framer-motion entrance animations.
- **Showcase**: responsive card grid (1/2/3 columns), filter tabs All / Projects / Awards; each card: screenshot gallery, title, description, tech chips, GitHub/demo link buttons. Adding an entry = adding an object to `projects.json` (or via admin).
- **Skills**: technical skills grouped by category with 5-segment proficiency bars; tool chips split into "Know" and "Currently learning" (e.g. GitHub).
- **Contact**: name, email, phone (optional), subject, message textarea; server-side validation, honeypot anti-spam field; saves to Firestore `messages` and emails you; success/error state.
- **Admin** (login required): tabs to edit Profile, Showcase entries (add/remove/reorder, image path fields), Skills; Save → Firestore; "Reset to repo JSON" button discards Firestore overrides so VS Code edits take effect again. Messages page lists submissions. Logout.

## Theme & responsiveness
Tokens in `globals.css` `@theme`: `cat-yellow #FFCD11`, `cat-black #0A0A0A`, `cat-charcoal #1F1F1F`, `cat-gray #8A8A8A`, white text. Tailwind breakpoints (sm/md/lg) for mobile → tablet → desktop; hamburger nav below `md`.

## Config / secrets (env vars only; Cloud Run secrets via Secret Manager)
`PORT`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `USE_FIRESTORE`, `GOOGLE_CLOUD_PROJECT`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`. Listed in `.env.example` without values; `.env*.local` gitignored.

## Cloud Run / PORT
- `next.config.ts`: `output: "standalone"`.
- Dockerfile: multi-stage node:22-slim build → runs `node server.js` (standalone server reads `PORT`; `HOSTNAME=0.0.0.0`). `npm start` = `next start -p ${PORT:-3000}` for local.
- Dockerfile ensures Cloud Run builds with Node even though `requirements.txt` exists (a buildpack-only deploy could mistake it for Python).

## requirements.txt
Next.js uses `package.json` for real installs; `requirements.txt` will list the runtime (Node 22) and each package with its pinned version, generated from `package.json`, with a header comment explaining it's documentation of the stack, not used by pip.

## README.md
Install Node/nvm, `npm install`, `npm run dev`, editing `content/*.json` and adding images, admin login, env vars, Firestore + SMTP (Gmail app password) setup, Cloud Run deploy from GitHub (Cloud Build trigger / `gcloud run deploy --source .`), Secret Manager.

## Verification
- `npm run lint` and `npm run build` pass.
- `PORT=8123 npm start` → app serves on 8123; same for `docker build` + `docker run -e PORT=8123` if Docker is available (it isn't currently installed — note if skipped).
- Browse every page at mobile/tablet/desktop widths; check mailto and LinkedIn links.
- `/admin` redirects to login without cookie; wrong password rejected; with `USE_FIRESTORE` off, saves fall back gracefully (clear message); contact form validates and logs/sends.
- Add a 4th entry in `projects.json` → appears on Showcase.

## Things you'll provide later
Profile photo (download from LinkedIn → `public/images/profile.jpg`; LinkedIn image URLs expire so hotlinking won't work), real bio/history/projects, LinkedIn URL, GCP project + Firestore, Gmail app password.
