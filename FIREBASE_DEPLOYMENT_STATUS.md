# Firebase Hosting Deployment Status

## Current deployment

- Firebase project: `prince-f7668`
- Firebase Hosting URL: https://prince-f7668.web.app
- Hosting release: successful
- Build output: `dist/public`
- Homepage check: HTTP 200
- Branding check: `Dragflow ai - AI Image Generator | Create Stunning Images with AI`
- SPA route check: `/privacy` returns the React app correctly

## Important limitation found

Firebase Hosting serves static files only. The current frontend sends tRPC requests to:

```text
/api/trpc
```

The current Express/tRPC backend is not running on Firebase Hosting. Because the Hosting rewrite currently falls back to `index.html`, requests such as `/api/trpc/auth.me` return HTML with HTTP 200 instead of JSON. This causes the browser error `Unexpected token '<'` and image generation cannot work from the Firebase URL yet.

The existing `functions/index.js` contains callable Functions (`generateImage`, `getUserImages`, and `deleteImage`) but it does not expose the current Express/tRPC `/api/trpc` contract. It should not be treated as a drop-in backend for the current frontend without an integration change.

## Required steps to make Firebase URL fully functional

1. Choose one free backend:
   - Keep the working Manus backend and connect the Firebase frontend to it, with CORS enabled for `https://prince-f7668.web.app`; or
   - Convert/deploy the current Express/tRPC backend as a Firebase HTTPS Function/Cloud Run service and route `/api/**` to it from Hosting.
2. Ensure the backend has its required server environment variables configured, including the image-generation API URL/key, storage credentials, database URL, and Firebase Admin project credentials.
3. In Firebase Console, open **Authentication → Settings → Authorized domains** and add:
   - `prince-f7668.web.app`
   - `prince-f7668.firebaseapp.com`
   - Any custom domain used later
4. Confirm Firestore rules and indexes are deployed if the Firebase Functions path is used.
5. Add a Hosting rewrite for `/api/**` only after a compatible HTTPS backend function exists. Do not use the SPA `index.html` fallback for API requests.
6. Retest `/api/trpc/auth.me` and an authenticated image generation request; both must return JSON, not HTML.

## Safe changes already applied

- Firebase Hosting `public` directory corrected from `dist` to `dist/public`.
- Firebase Admin initialization no longer uses the unrelated hard-coded project ID; it follows `FIREBASE_PROJECT_ID`, `GCLOUD_PROJECT`, or defaults to `prince-f7668`.
- Production build and TypeScript checks pass.

No Firebase service-account JSON or private key is stored in this repository.
