
## Latest integration update

The Firebase production build now uses the public backend URL:

```text
https://leonardoai-6kye8rpe.manus.space/api/trpc
```

The frontend build was redeployed to Firebase Hosting and the URL is embedded in the generated JavaScript. The backend source also now includes restricted CORS for the Firebase Hosting domains and was verified locally with a successful HTTP 204 preflight.

The existing live Manus backend still needs to be republished from the updated project checkpoint before browsers will receive the new CORS headers. Until that publish is completed, Firebase sign-in can load, but cross-origin API requests from Firebase may be blocked by the browser.

After publishing the Manus backend, retest with:

```bash
curl -i -X OPTIONS https://leonardoai-6kye8rpe.manus.space/api/trpc \
  -H 'Origin: https://prince-f7668.web.app' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: authorization,content-type'
```

Expected response headers include:

```text
Access-Control-Allow-Origin: https://prince-f7668.web.app
Access-Control-Allow-Credentials: true
```

## Clean Hosting site

- Clean Firebase Hosting site created: `dragonimage`
- Clean URL: https://dragonimage.web.app
- Deployment verified: HTTP 200
- Branding verified: `Dragflow ai - AI Image Generator | Create Stunning Images with AI`
- SPA route fallback verified: `/privacy` returns the React app
- Frontend bundle still points to the free Manus backend API
- Backend CORS source now includes `https://dragonimage.web.app`; the updated Manus backend must be published before that live CORS change takes effect

### Firebase Console action

In Firebase Console, open **Authentication → Settings → Authorized domains** and add:

```text
dragonimage.web.app
```

Keep `prince-f7668.web.app` only if you still want the old URL to remain usable. The old site has not been deleted.

## Cleanup and Auth troubleshooting

- Deleted secondary site `prince-f7668-6831e.web.app`.
- Firebase does not allow deleting the project's default Hosting site `prince-f7668.web.app`; this is a Firebase platform restriction. It is no longer used for deployment.
- `dragonimage.web.app` is the active clean Hosting site.
- The Firebase browser config contains `apiKey`, `projectId`, `appId`, and messaging IDs. These are public client identifiers, not private secrets. Private Admin keys and image-generation API keys must stay server-side.
- The login hook now uses mobile redirect sign-in instead of popup sign-in and shows clearer messages for `auth/user-cancelled`, popup closure, unauthorized domain, and disabled providers.
- Add `dragonimage.web.app` in Firebase Console → Authentication → Settings → Authorized domains. Without this, Firebase Auth can reject the clean domain.
- The image-generation API still depends on publishing the updated Manus backend CORS change; Firebase Hosting alone cannot run the Express/tRPC server.
