# Personal Portfolio

A multi-page portfolio site with a Caterpillar yellow-and-black theme. It works on desktop, tablet, and mobile.

**Pages:** Home · Showcase (projects & awards) · Skills · Contact · Admin (password-protected editor)

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS 4 · Lucide icons · Framer Motion · Google Firestore · Nodemailer. Exact versions are listed in `requirements.txt` (for reference only; installs use `package.json`).

---

## 1. Install

You need **Node.js 22**. If you don't have it, install it with nvm:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 22
```

Then install the project's packages:

```bash
npm install
```

## 2. Run locally

```bash
cp .env.example .env.local   # then fill in values (at least ADMIN_PASSWORD and SESSION_SECRET)
npm run dev                  # http://localhost:3000
```

Production mode:

```bash
npm run build
PORT=8080 npm start          # the app listens on $PORT (default 3000)
```

Other commands: `npm run lint`.

## 3. Edit your content

All page content lives in the `content/` folder. Edit these in VS Code and save — no code changes needed.

| File | What it controls |
| --- | --- |
| `content/profile.json` | Name, job title, company, location, photo, bio, email, LinkedIn/GitHub links, work history, education |
| `content/projects.json` | Showcase entries. Each one has `type` (`project` or `award`), `title`, `description`, `tech` (list), `links` (`label` + `url`), and `images` (list of paths or URLs) |
| `content/skills.json` | Technical skills with `level` 1–5 (Beginner → Expert) and `category`, plus tools you know and tools you're learning |

**Add a showcase entry:** copy one of the objects in `projects.json`, give it a new unique `id`, and edit the fields.

**Images:** put files in `public/images/` and refer to them as `/images/<file name>`.

**Profile photo:** download your LinkedIn picture (LinkedIn image links expire, so don't link to them directly), save it as `public/images/profile.jpg`, and set `"photo": "/images/profile.jpg"` in `profile.json`.

**Colors:** the whole theme is set in one place — the `@theme` block at the top of `src/app/globals.css`.

## 4. Edit in the app (Admin)

Go to `/admin` (there's also a small "Admin" link in the footer) and log in with `ADMIN_PASSWORD`. Visitors can't edit anything without the password.

- **Edit content** — tabs for Profile, Showcase, and Skills. **Save** writes your changes to Firestore and updates the live site immediately.
- **Reset to repo JSON** — throws away in-app edits for that section, so the site uses the `content/*.json` file again.
- **Messages** — everything sent through the contact form.

How the two editing methods fit together: if a section was saved from the admin page, the Firestore copy wins. Otherwise, the JSON file from the repository is used. If you edit a JSON file in VS Code after editing that section in the app, click **Reset to repo JSON** for your file changes to show.

Saving in the app needs Firestore (`USE_FIRESTORE=true`). Without it, the admin page is read-only and the site uses the JSON files.

## 5. Settings (environment variables)

Put these in `.env.local` locally (never commit it). On Cloud Run, store them as environment variables, and store the secret ones in Secret Manager. `.env.example` lists them all.

| Variable | Purpose |
| --- | --- |
| `PORT` | Port to listen on. Cloud Run sets this automatically. |
| `ADMIN_PASSWORD` | Password for `/admin`. **Secret.** |
| `SESSION_SECRET` | Long random string used to sign the admin login cookie. **Secret.** Generate one with `openssl rand -hex 32`. |
| `USE_FIRESTORE` | `true` to store admin edits and contact messages in Firestore. |
| `GOOGLE_CLOUD_PROJECT` | Your GCP project ID (needed for Firestore when running locally). |
| `SMTP_HOST`, `SMTP_PORT` | Mail server, e.g. `smtp.gmail.com` and `465`. |
| `SMTP_USER`, `SMTP_PASS` | Mail account and password. For Gmail, use an [app password](https://support.google.com/accounts/answer/185833). `SMTP_PASS` is **secret**. |
| `CONTACT_TO_EMAIL` | Where contact-form emails are sent, e.g. `mteoba77@yahoo.com`. |

**Contact form behavior:** each message is saved to Firestore (if it's on) **and** emailed to you (if SMTP is set). If neither is set up, the message is only written to the server log.

## 6. Deploy to Google Cloud Run (from GitHub)

The `Dockerfile` builds a small production image. The server listens on the `PORT` that Cloud Run provides.

**One-time Google Cloud setup**

1. Create or choose a project, then turn on the services the app uses:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com firestore.googleapis.com secretmanager.googleapis.com
   ```
2. Create a Firestore database in **Native mode**:
   ```bash
   gcloud firestore databases create --location=us-central1
   ```
3. Store your secrets:
   ```bash
   printf 'your-admin-password' | gcloud secrets create ADMIN_PASSWORD --data-file=-
   openssl rand -hex 32 | tr -d '\n' | gcloud secrets create SESSION_SECRET --data-file=-
   printf 'your-gmail-app-password' | gcloud secrets create SMTP_PASS --data-file=-
   ```
4. Let Cloud Run's service account read the secrets and use Firestore (by default it's `PROJECT_NUMBER-compute@developer.gserviceaccount.com`). Give it the **Secret Manager Secret Accessor** and **Cloud Datastore User** roles.

**Deploy from GitHub (continuous deployment)**

1. Push this project to a GitHub repository.
2. In the Cloud Console, go to **Cloud Run → Deploy container → Service → Continuously deploy from a repository**, connect GitHub, and pick the repo and branch.
3. In **Cloud Build → Triggers**, edit the trigger it created and set Configuration to **Cloud Build configuration file (yaml/json)**, location `/cloudbuild.yaml`. That file builds the `Dockerfile`, pushes the image, and deploys it to Cloud Run.
   - Don't use **Buildpacks**. They ignore the Dockerfile and run `next start`, which uses much more memory and can exceed Cloud Run's 512 MiB limit.
   - Don't use the plain **Dockerfile** option. It only builds the image and never deploys it.
   - If your service or region isn't `personal-portfolio` / `us-west1`, change them in `cloudbuild.yaml`.
4. Turn on **Allow unauthenticated invocations** so the public can see the site.
5. Under **Variables & Secrets**, add:
   - Environment variables: `USE_FIRESTORE=true`, `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=you@gmail.com`, `CONTACT_TO_EMAIL=mteoba77@yahoo.com`
   - Secrets as environment variables: `ADMIN_PASSWORD`, `SESSION_SECRET`, `SMTP_PASS`

Every push to that branch then rebuilds and redeploys the site.

**Or deploy once from your machine:**

```bash
gcloud run deploy portfolio --source . --region us-central1 --allow-unauthenticated \
  --set-env-vars USE_FIRESTORE=true,SMTP_HOST=smtp.gmail.com,SMTP_PORT=465,SMTP_USER=you@gmail.com,CONTACT_TO_EMAIL=mteoba77@yahoo.com \
  --set-secrets ADMIN_PASSWORD=ADMIN_PASSWORD:latest,SESSION_SECRET=SESSION_SECRET:latest,SMTP_PASS=SMTP_PASS:latest
```

**Test the container locally** (needs Docker):

```bash
docker build -t portfolio .
docker run -p 8080:8080 -e PORT=8080 -e ADMIN_PASSWORD=test -e SESSION_SECRET=dev portfolio
```

## Project layout

```
content/            Editable page content (JSON)
public/images/      Profile photo and project screenshots
src/app/            Pages: home, showcase, skills, contact, admin
src/components/     UI components (admin editor in components/admin/)
src/lib/            Content loading, Firestore, auth, email, types
src/middleware.ts   Keeps /admin behind the login
Dockerfile          Production image for Cloud Run
```
