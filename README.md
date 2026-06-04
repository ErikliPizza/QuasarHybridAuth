## Hi

Quasar Hybrid Auth is a starter front-end for Quasar apps that need SPA, Capacitor, and Electron-friendly authentication flows.

## IMPORTANT!

- **Strongly recommended** to use 8080 port for front-end and 8000 port for the back-end due to SPA Auth CORS Policies. Remember that SPA Auth method works only if the back-end and front-end deployed over same server.
- **You may want to refactor boot/axios.js file and the .env files** due to complexity of mixing the network requests with local environment. For example Capacitor: Android Studio takes the target local url as http://10.0.2.2:8000, while Electron works like a desktop Chromium browser and can use your localhost URL. Please refactor the axios file when it is time to deploy.
- **Electron is supported by this starter, but `src-electron` is intentionally not included.** Create or generate your own Electron files when you are ready to develop the desktop app.

## RECOMMENDED UP COMMANDS

- **SPA:** `quasar dev --port=8080` (if you use 8000 for your server)
- **ELECTRON:** create your own `src-electron` files first, then run `quasar dev -m electron`
- **CAPACITOR:** `quasar dev -m capacitor -T android --ide` (edit quasar config file based on your executable android studio path e.g linuxAndroidStudio: "/snap/android-studio/161/bin/studio.sh")

## RECOMMENDED ENV CONFIG

VITE_API_BASE_URL=http://localhost:8000
VITE_API_BASE_URL_MOBILE=http://10.0.2.2:8000
VITE_API_BASE_PREFIX=api/v1

## BUILD COMMANDS

- **SPA:** `npm run build`
- **ELECTRON:** after creating your own `src-electron` files, use Quasar Electron mode, for example `quasar build -m electron`
