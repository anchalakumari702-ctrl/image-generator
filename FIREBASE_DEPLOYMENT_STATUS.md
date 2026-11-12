
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
