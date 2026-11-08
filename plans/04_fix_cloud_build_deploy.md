# Make Google Cloud actually deploy the new build

## Context
After the last fix, you switched the Cloud Build trigger to Dockerfile and pushed `962e20c`. What the checks show now:
- **The build succeeded.** Build `c50eda6c` built the Dockerfile image and pushed it to
  `us-west1-docker.pkg.dev/deft-cove-222207/cloud-run-source-deploy/personal_portfolio/personal-portfolio:962e20c…`.
- **It was never deployed.** Editing the trigger replaced its steps with one `docker build` step. The old "deploy to Cloud Run" step is gone, so every push now builds an image and stops there.
- Cloud Run is still serving the **old Buildpacks image** (`…:729adb1…`). Revision 00005 only changed memory to 1Gi. That's why the site still returns **HTTP 503** and the logs still show connection errors.

The fix is to deploy the new image, and to give the trigger a build file that builds, pushes **and** deploys on every push.

## Changes
1. Log the prompt in `PROMPTS.md`; save this plan as `plans/04_fix_cloud_build_deploy.md`.
2. **Add `cloudbuild.yaml`** at the project root with 3 steps:
   - `gcr.io/cloud-builders/docker` `build -t IMAGE .`
   - `gcr.io/cloud-builders/docker` `push IMAGE`
   - `gcr.io/google.com/cloudsdktool/cloud-sdk:slim` → `gcloud run deploy personal-portfolio --image IMAGE --region us-west1 --quiet`

   where `IMAGE = us-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/$REPO_NAME/personal-portfolio:$COMMIT_SHA`, plus `images: [IMAGE]` and `options.logging: CLOUD_LOGGING_ONLY`. Only `--image` changes, so your existing env vars, secrets and memory stay as they are.
3. **Deploy the already-built image now** so the site works right away (I'll run this):
   `gcloud run deploy personal-portfolio --image us-west1-docker.pkg.dev/deft-cove-222207/cloud-run-source-deploy/personal_portfolio/personal-portfolio:962e20c8571061a7d5075a3af20272aaea8b0354 --region us-west1`
4. **README.md:** replace the "Build type: Dockerfile" step with: set the trigger's Configuration to **Cloud Build configuration file**, location `/cloudbuild.yaml`.

## You do (in the Console)
5. Cloud Build → Triggers → edit `cloudrun-personal-portfolio-us-west1-…` → Configuration: **Cloud Build configuration file (yaml/json)**, Location: Repository, `/cloudbuild.yaml` → Save.
6. Commit and push `portfolio_app`. Cloud Build should then show 3 green steps and a new Cloud Run revision.

## Verification
- After step 3: `curl -I https://personal-portfolio-143312829237.us-west1.run.app/` returns 200, and the logs show `node server.js` with no memory or 503 errors.
- After step 6: `gcloud run services describe personal-portfolio --region us-west1 --format='value(spec.template.spec.containers[0].image)'` shows the new commit's SHA.
- Optional, once it's stable: set memory back to 512Mi (`gcloud run services update personal-portfolio --memory=512Mi --region=us-west1`).
