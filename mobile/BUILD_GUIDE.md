# FinTrack Android Build Guide (Windows)

## ✅ Fixed Configuration

Your EAS configuration has been updated to work with **cloud builds** on Windows. Local builds are not supported on Windows for Android.

## 📋 Prerequisites

1. **Install EAS CLI** (if not installed)

   ```powershell
   npm install -g eas-cli
   ```

2. **Verify installation**

   ```powershell
   eas --version
   ```

3. **Create Expo Account** (if you don't have one)
   - Visit https://expo.dev and sign up

## 🚀 Build Commands for Windows

### Step 1: Login to EAS

```powershell
cd mobile
eas login
```

### Step 2: Configure Project (First-time only)

```powershell
eas build:configure
```

### Step 3: Build APK for Testing (Preview Build)

```powershell
eas build --platform android --profile preview
```

This command will:

- ✅ Build on Expo's cloud servers (Windows compatible)
- ✅ Generate an APK file (installable on any Android device)
- ✅ Include environment variables from eas.json
- ✅ Take ~10-20 minutes for the first build

### Step 4: Build AAB for Production (Google Play Store)

```powershell
eas build --platform android --profile production
```

This command will:

- ✅ Generate an AAB file (for Play Store submission)
- ✅ Auto-increment version number
- ✅ Use production environment variables

## 📦 Configuration Changes Made

### 1. **eas.json** - Updated for Cloud Builds

```json
{
  "preview": {
    "distribution": "internal",
    "android": {
      "buildType": "apk" // ✅ Generates APK
    }
  },
  "production": {
    "android": {
      "buildType": "app-bundle" // ✅ Generates AAB for Play Store
    }
  }
}
```

### 2. **app.json** - Added Android Permissions

```json
{
  "android": {
    "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
  }
}
```

## 🔧 Troubleshooting

### Error: "Unsupported platform, macOS or Linux is required"

❌ **Don't use**: `eas build --local`  
✅ **Use instead**: `eas build --platform android --profile preview`

The `--local` flag requires macOS/Linux. Always use cloud builds on Windows.

### Error: "Install dependencies build phase failed"

1. Delete `node_modules` and reinstall:

   ```powershell
   rm -r node_modules
   npm install
   ```

2. Clear npm cache:

   ```powershell
   npm cache clean --force
   npm install
   ```

3. Verify package.json has no corrupted dependencies

### Error: "Missing environment variables"

Environment variables are now included in `eas.json` under each profile's `env` section. No separate `.env` file needed for builds.

## 📱 Download & Install APK

### After Build Completes:

1. **From Terminal**:

   - The build output will show a download URL
   - Copy the URL and download the APK

2. **From Expo Dashboard**:

   - Visit: https://expo.dev/accounts/[your-username]/projects/mobile/builds
   - Find your build
   - Click **Download** button

3. **Install on Android Device**:
   - Transfer APK to your phone
   - Enable "Install from Unknown Sources" in Settings → Security
   - Tap the APK file to install

## 🎯 Quick Command Reference

```powershell
# Navigate to mobile folder
cd mobile

# Login to EAS
eas login

# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production

# Check build status
eas build:list

# View build logs
eas build:view [build-id]
```

## ⚙️ Build Profiles Explained

| Profile       | Build Type | Use Case                    | Output             |
| ------------- | ---------- | --------------------------- | ------------------ |
| `preview`     | APK        | Testing on devices          | Direct install APK |
| `production`  | AAB        | Google Play Store           | Play Store bundle  |
| `development` | APK        | Development with dev client | Dev build APK      |

## 🌐 Backend Configuration

Before building, ensure your backend URL is correctly set:

1. Deploy your backend to a hosting service (Render, Railway, Vercel, etc.)
2. Update `mobile/constants/api.js` with your production backend URL
3. Do NOT use `localhost` or `127.0.0.1` in production builds

## 📊 Build Status Monitoring

Monitor your build in real-time:

```powershell
eas build:list
```

Or visit the Expo dashboard:
https://expo.dev/accounts/[your-username]/projects/mobile/builds

## 🎉 Success Indicators

When the build succeeds, you'll see:

- ✅ "Build finished"
- ✅ Download link for APK/AAB
- ✅ QR code to install directly on device

## 💡 Pro Tips

1. **First build takes longer** (~15-30 min) - subsequent builds are faster
2. **Free tier limits**: Check your remaining builds at expo.dev
3. **Credentials**: EAS automatically manages your Android keystore
4. **Version bumping**: Production profile auto-increments version
5. **Environment variables**: Already configured in eas.json

## 🔐 Credentials Management

EAS automatically handles:

- Android keystore generation
- Signing certificate management
- Credential storage and security

No manual keystore setup needed!

## 📞 Support

If you encounter issues:

1. Check build logs: `eas build:view [build-id]`
2. Visit Expo forums: https://forums.expo.dev
3. Check Expo docs: https://docs.expo.dev/build/introduction/

---

**Ready to build?** Run:

```powershell
cd mobile
eas login
eas build --platform android --profile preview
```
