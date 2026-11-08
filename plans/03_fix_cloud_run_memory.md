# Fix Cloud Run "Memory limit of 512 MiB exceeded"

## Context
Cloud Run logs for `personal-portfolio` (us-west1) show each instance getting killed with `Memory limit of 512 MiB exceeded with ~540 MiB used`. Requests then fail with 503.

Root cause, from the logs and the Cloud Build trigger:
- The GitHub trigger `cloudrun-personal-portfolio-us-west1-...` builds with **Buildpacks** (`gcr.io/buildpacks/builder`), not our Dockerfile. So the container runs `next start` instead of the small standalone `node server.js`.
- When it starts, Next sees `next.config.ts`, can't find TypeScript (devDependencies were removed), and runs **`npm install typescript` inside the live container** ("Installing TypeScript as it was not found while loading next.config.ts"). That npm install pushes memory over 512 MiB.
- The service is still at 512Mi (no new revision), so your `--memory=1Gi` update didn't take effect. More memory would only hide the problem anyway.

## Changes (code)
1. Log the prompt in `PROMPTS.md`; save this plan as `plans/03_fix_cloud_run_memory.md`.
2. Rename `next.config.ts` → `next.config.mjs`, with the same settings (`output: "standalone"`, `outputFileTracingIncludes`) and a JSDoc `@type {import('next').NextConfig}`. Next no longer needs TypeScript at runtime, so the npm install at startup stops whichever builder is used.
3. Update `README.md`'s deploy section: the Cloud Build trigger must use the **Dockerfile**, not Buildpacks, and show how to check that.

## Changes (you, in Google Cloud. I won't change cloud settings)
4. Switch the trigger to the Dockerfile: Console → Cloud Build → Triggers → edit the trigger → Configuration → **Dockerfile** (path `/Dockerfile`, context `/`) → Save. The standalone server should use roughly 100–200 MiB, so 512Mi is enough.
5. Push the branch, or run the trigger, to redeploy.
6. Optional: `gcloud run services update personal-portfolio --memory=1Gi --region=us-west1`. If this errors, paste the output; you didn't include the error text in your message.

## Verification
- Locally: `npm run build && node .next/standalone/server.js` starts with no TypeScript install message.
- After redeploying: the logs show `node server.js` (not `next start`), with no "Installing TypeScript" and no memory-limit errors:
  `gcloud logging read 'resource.labels.service_name="personal-portfolio" AND severity>=WARNING' --freshness=1h --limit=20`
- The site loads at https://personal-portfolio-143312829237.us-west1.run.app.
