# Production Deployment Guide — e-nyaya sarthi (CCS App)

This guide covers making the app production-ready, building an **AAB** (Android App Bundle) or **APK**, and uploading to the **Google Play Store**.

---

## Prerequisites

- **Node.js** (v18+)
- **Expo CLI** and **EAS CLI** installed globally:
  ```bash
  npm install -g eas-cli
  ```
- **Expo account** (logged in: `eas login`)
- **Google Play Console** account (one-time $25 registration)

---

## 1. Pre-deployment checklist (production readiness)

Before building for production, ensure:

| Step                  | Action                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Version**           | Set correct `version` in `app.json` (e.g. `"1.0.0"`). Play Store uses this for display.                      |
| **Runtime version**   | Your app uses `runtimeVersion: { "policy": "appVersion" }` — OTA updates will use app version.               |
| **Secrets / env**     | Remove dev API URLs, keys, or debug flags. Use EAS Secrets for env vars in builds.                           |
| **Proguard / minify** | R8 code shrinking and resource shrinking enabled via `expo-build-properties` in app.json. Reduces AAB size.  |
| **Signing**           | EAS manages signing. First build will prompt to create credentials (or use existing).                        |
| **Icons & splash**    | Confirm `./assets/images/icon.png` and splash exist and look correct.                                        |
| **Test**              | Run a production-like build locally: `eas build --profile production --platform android --local` (optional). |

---

## 2. Install EAS CLI and log in

```bash
npm install -g eas-cli
eas login
```

Use the same Expo account that owns the project (e.g. `law_1110`).

---

## 3. Build Android App Bundle (AAB) — recommended for Play Store

Google Play requires **AAB** for new apps. Your `eas.json` production profile builds AAB by default.

```bash
# From project root
cd /path/to/CCS_APP

# Build AAB for production (recommended)
eas build --platform android --profile production
```

- EAS will ask to create or use existing **Android keystore** (save backups securely).
- Build runs on Expo servers. When done, you get a **download link** for the `.aab` file.
- Download the AAB from the link in the terminal or from [expo.dev](https://expo.dev) → your project → Builds.

**Optional: build and download in one go**

```bash
eas build --platform android --profile production --non-interactive
```

Then download the AAB from the build page.

---

## 4. Build APK (for testing or sideloading)

For internal testing or sideloading (not for Play Store upload as primary artifact), use the **preview** profile (already set to `buildType: "apk"`):

```bash
eas build --platform android --profile preview
```

To have a **production** APK (same as production but APK instead of AAB), add a profile in `eas.json`:

```json
"production-apk": {
  "extends": "production",
  "android": {
    "buildType": "apk"
  }
}
```

Then run:

```bash
eas build --platform android --profile production-apk
```

---

## 5. Final cURL for production build (reference)

These are the **exact** commands to get a production AAB and then submit.

### Step 1 — Build AAB

```bash
cd /Users/hamzahamal/Desktop/CCS_APP
eas build --platform android --profile production --non-interactive
```

### Step 2 — Submit to Play Store (after build completes)

```bash
# Submit latest production Android build
eas submit --platform android --profile production --latest
```

For first-time submission you will need to set up **Google Play credentials** in EAS (service account or manual upload). See section 7 below.

---

## 6. Upload to Google Play Store

### Option A: EAS Submit (recommended)

1. **Create a Google Play service account** (one-time):

   - Go to [Google Play Console](https://play.google.com/console) → **Setup** → **API access**.
   - Link a Google Cloud project and create a **service account**.
   - Grant the service account access in Play Console (e.g. “Release to production” or “Release to testing”).
   - Download the **JSON key** for the service account.

2. **Configure EAS Submit**:

   ```bash
   eas credentials
   ```

   - Choose **Android** → **production** (or the profile you use).
   - Add **Google Service Account Key**: upload the JSON key when prompted.

3. **Submit the latest build**:
   ```bash
   eas submit --platform android --profile production --latest
   ```
   - Select the track: **internal testing**, **closed testing**, **open testing**, or **production**.

### Option B: Manual upload

1. Download the **AAB** from [expo.dev](https://expo.dev) → your project → **Builds**.
2. Go to [Google Play Console](https://play.google.com/console) → your app.
3. **Release** → **Production** (or **Testing** → **Internal/Closed/Open**).
4. **Create new release** → upload the AAB.
5. Add **Release name** (e.g. `1.0.0 (1)`) and **Release notes**.
6. **Review and roll out**.

---

## 6.1 R8/ProGuard deobfuscation file (mapping.txt)

Play Console may show: *"There is no deobfuscation file associated with this App Bundle"* when you use R8 obfuscation. The mapping file lets Play Console translate obfuscated crash stack traces into readable form for debugging.

**EAS Build:** The R8 mapping file is not currently available as a build artifact from EAS cloud builds (the `mapping` output folder is not generated in the Expo/React Native build structure). With newer Android Gradle Plugin versions, the mapping file may be included automatically inside the AAB—if you still see the Play Console warning after uploading, you can:

1. **Build locally** to obtain the mapping file:
   ```bash
   npx expo prebuild --platform android --clean
   eas build --platform android --profile production --local
   ```
   After the build, look for `android/app/build/outputs/mapping/release/mapping.txt` or `android/app/build/outputs/bundle/release/mapping.txt`.

2. **Upload to Play Console** (if you have the file):
   - **Test and release** → **App bundle explorer** → select the AAB version.
   - **Downloads** tab → **Assets** → upload the mapping file.

**Note:** Each build produces a new mapping file. It must match the exact AAB version. You can ignore the warning if crash debugging is not critical; crashes will still be reported but with obfuscated stack traces.

---

## 7. Store listing: screenshots and description

Where to add these in Play Console: **Grow** → **Store presence** → **Main store listing** (or **Store setup** → **Main store listing**).

### 7.1 Screenshots

- **Phone (required)**

  - At least **2 images**, up to **8**.
  - Min size: **320 px** on the shortest side.
  - Max size: **3840 px** on the longest side.
  - Recommended: **1080 × 1920 px** (9:16) or **1080 × 2340 px**.
  - Format: **PNG** or **JPEG** (no alpha for JPEG).

- **7-inch tablet (optional)**

  - Recommended: **1200 × 1920 px** or **1920 × 1200 px**.

- **10-inch tablet (optional)**
  - Recommended: **1600 × 2560 px** or **2560 × 1600 px**.

**How to add:**

1. Play Console → your app → **Grow** → **Store presence** → **Main store listing**.
2. Under **Phone screenshots**, click **Add** and upload images (drag & drop or Choose files).
3. Order them by dragging; the first image is the one users see first.
4. Add tablet screenshots in the **7-inch** and **10-inch** sections if you support tablets.

**Tips:**

- Use real app screens (no heavy device frames unless you keep them consistent).
- Show the main flows: home, key feature, settings or profile.
- Keep status bar and text readable; avoid sensitive or placeholder data.
- You can add **optional graphics** (e.g. feature graphic **1024 × 500 px**) under **Graphics** in the same store listing.

---

### 7.2 App description

- **Short description**

  - Max **80 characters**.
  - Shown in search and listing.
  - Example: _"Access e-Courts services, case status, and legal information on the go."_

- **Full description**
  - Max **4000 characters**.
  - Shown on the app's Play Store page.
  - Use plain text; no HTML. Line breaks are allowed.
  - Structure with a short intro, then bullet points or short paragraphs for features, and a closing line (e.g. support/feedback).

**How to add:**

1. Same place: **Main store listing**.
2. **Short description**: type in the 80-character field.
3. **Full description**: type or paste in the long description box.
4. Use **Save** (or **Send for review** when you publish the listing).

**Example full description (adjust for your app):**

```text
e-nyaya sarthi brings e-Courts and CCS services to your phone.

• Check case status and cause list
• Access acts, rules, and legal information
• Secure login and official links to court services
• Works on phones and tablets

Official app for [your org]. For support, contact [your contact].
```

---

## 8. Play Console one-time setup (new app)

If the app is not yet on Play Store:

1. **Create app** in Play Console: **All apps** → **Create app**.
2. **Complete required sections**:
   - **Store listing**: short description, full description, screenshots, icon, feature graphic (see section 7).
   - Content rating questionnaire.
   - Target audience and news app declaration (if applicable).
   - Privacy policy URL (if you collect data).
   - App access (e.g. “All functionality available without restrictions” or login details for reviewers).
3. **Pricing & distribution**: free/paid, countries.
4. **Release** → create a release (internal testing first is recommended), upload the AAB, then promote to production when ready.

---

## 9. Versioning for future releases

- **Version code** (integer): EAS can auto-increment (`"autoIncrement": true` in `production` profile). Do not set it manually if you use this.
- **Version name**: Update in `app.json` → `expo.version` (e.g. `"1.0.1"`) for each store release.

Then build and submit again:

```bash
eas build --platform android --profile production --non-interactive
eas submit --platform android --profile production --latest
```

---

## 10. Quick reference — final commands

| Goal                                   | Command                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| **Build AAB (production)**             | `eas build --platform android --profile production`                            |
| **Build APK (preview)**                | `eas build --platform android --profile preview`                               |
| **Submit to Play Store**               | `eas submit --platform android --profile production --latest`                  |
| **Build + submit (after first setup)** | Build once, then `eas submit --platform android --profile production --latest` |

---

## 10. Troubleshooting

- **“No credentials”**: Run `eas credentials` and configure Android keystore / Play Store key.
- **Build fails**: Check [expo.dev](https://expo.dev) build logs; fix missing env (EAS Secrets) or native config.
- **Play Console rejects AAB**: Ensure version code is higher than previous upload; complete all required Console sections.
- **Signing errors**: Do not commit keystores; let EAS manage them or upload your own in `eas credentials`.

---

_Last updated for Expo SDK 54 and EAS Build/Submit. Adjust version numbers and profile names to match your project._
