# PocketKit Android - Google Play Store Publishing Guide

This guide walks you through generating a signed Android App Bundle (.aab) and APK to publish PocketKit on Google Play Store.

---

## 1. Prerequisites
- **Android Studio Iguana / Jellyfish** (or higher)
- **JDK 17** (standard for Android Gradle Plugin 8+)
- **Google Play Developer Account** ($25 one-time registration)

---

## 2. Generate a Production Signing Keystore
Run the following command in terminal to create your release keystore:

```bash
keytool -genkey -v -keystore pocketkit-release.keystore \
  -alias pocketkit \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

When prompted:
- Enter a secure password (e.g. `pocketkit123`)
- Fill in your Organization / Developer details
- Keep `pocketkit-release.keystore` safe! (Never commit keystores to public git repositories)

---

## 3. Configure Release Signing
Set your keystore environment variables or add them to your `~/.gradle/gradle.properties`:

```properties
KEYSTORE_PATH=/path/to/pocketkit-release.keystore
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=pocketkit
KEY_PASSWORD=your_key_password
```

---

## 4. Build Signed Android App Bundle (.aab) for Play Store
Google Play requires `.aab` (Android App Bundle) format for all new apps:

```bash
cd apps/android
./gradlew bundleRelease
```

The resulting file will be located at:
`apps/android/app/build/outputs/bundle/release/app-release.aab`

---

## 5. Build Direct APK (.apk) for Direct Download / Sideloading
To generate the standalone `.apk` for users to install directly on their devices:

```bash
./gradlew assembleRelease
```

The resulting APK will be located at:
`apps/android/app/build/outputs/apk/release/PocketKit-release.apk`

---

## 6. Google Play Console Checklist

### App Details:
- **App Name**: PocketKit - MultiTools Digital Workshop
- **Short Description**: 70+ client-side tools for PDF, images, calculators, text formatting & encryption.
- **Full Description**:
  PocketKit is your pocket-sized digital workshop. 100% private, client-side online tools for text editing, code formatting, image manipulation, PDF tasks, calculators, and cryptography. No signups required, zero data collection.
- **Category**: Tools & Productivity
- **Content Rating**: Everyone (3+)

### Store Assets:
- **App Icon**: 512 x 512 px 32-bit PNG (with alpha) - use `public/pwa-512x512.png`
- **Feature Graphic**: 1024 x 500 px JPG or PNG
- **Screenshots**: At least 4 phone screenshots (1080 x 1920 px or 1080 x 2400 px)

### Data Safety Questionnaire:
- **Does your app collect or share user data?**: Select **NO**.
- PocketKit processes all documents, photos, text, and calculations 100% locally on the user's device via client-side JavaScript.
- No analytics SDK, no location tracking, no user accounts.

### Privacy Policy:
- Provide your live URL: `https://pocketkit.app/#privacy`

---

## 7. Rollout Track
1. Go to **Production** or **Internal Testing** in Google Play Console.
2. Click **Create new release**.
3. Upload `app-release.aab`.
4. Enter release notes: `Initial release of PocketKit v2.0.4 with 70+ client-side offline tools.`
5. Review and roll out release!
