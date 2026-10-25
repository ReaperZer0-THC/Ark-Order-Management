# Optional AI order interpretation (development)

The tracker remains local-first. AI is used **only** when a staff member clicks **Interpret with AI**. Manual and rule-based imports remain available.

## Deploy secure backend

1. Create a Cloudflare Worker and deploy `worker/interpret.js`.
2. Add the secret `OPENAI_API_KEY` in Worker settings (never in the website, repository, or browser).
3. Set `ALLOWED_ORIGIN=https://reaperzer0-thc.github.io` in Worker environment variables. The backend permits only that browser origin, but CORS is not authentication.
4. Optionally set `OPENAI_MODEL` to a supported vision-capable model.
5. In the website's Discord Import screen, enter the Worker HTTPS URL ending in `/interpret`.

## Important before real deployment

This is an integration prototype, **not yet a production-secure public endpoint**. Add staff authentication, request rate limiting and a usage budget before sharing the Worker URL. CORS alone does not stop direct API calls or abuse. Avoid sending private Discord messages without authorization. Requests include order text, optionally an image, and the creature registry; no saved inventory or order history is sent. API usage incurs charges.

AI output is not authoritative: verify customer, creature variants, quantities, optional females and payment before importing. Browser localStorage remains the source of truth for the tracker. The current frontend only supports one image per AI request.
