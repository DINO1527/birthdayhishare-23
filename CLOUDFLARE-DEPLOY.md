# Cloudflare Workers deployment

This project uses the OpenNext adapter for Cloudflare Workers. The 24 story photos remain as files in `private/images`; no R2 bucket is required.

## Build settings

In **Workers & Pages → birthdayhishare-23 → Settings → Build**, connect this repository's `main` branch and set:

| Setting | Value |
| --- | --- |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npm run deploy:cloudflare` |
| Root directory | Repository root |

The build generates `.open-next/worker.js`, then copies `private/images` to `.open-next/assets/_private-story-images`. `wrangler.jsonc` routes direct requests for that asset prefix through the Worker. `src/proxy.ts` returns 404 for direct requests. The authenticated `/api/story-photo/...` route fetches the assets internally after checking the signed story session.

## Runtime secrets

In **Settings → Variables and Secrets**, add these as **Secrets** and deploy the updated Worker:

- `STORY_SESSION_SECRET`: one stable random value of at least 32 characters.
- `STORY_ANSWER_1`: expected answer to the first entrance question.
- `STORY_ANSWER_2`: expected answer to the second entrance question.

Do not commit secret values to Git. These are runtime secrets; the current build does not need them in Build variables and secrets.

## Adding or replacing a photo

1. Put the optimized `.webp` file in the matching folder under `private/images`.
2. Keep the same filename if replacing a photo. For a new photo, update the matching path in `src/data/story.ts` or the component that uses it.
3. Commit and push the files. Cloudflare will rebuild and upload them with the Worker assets.
4. After deployment, check that `/_private-story-images/hero/couple-hero.webp` returns 404 directly. Then unlock the story and check that `/api/story-photo/hero/couple-hero.webp` returns the photo.

The old Cloudflare Pages `.pages.dev` deployment does not run the API routes. Use the Workers deployment URL.
