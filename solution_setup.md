# Complete Setup Solution - Jewelry React Native App

This document contains all the commands and fixes that were applied to get the project working from scratch to a fully functional state on Windows with Expo Go SDK 54.

---

## 📋 Initial Prerequisites Check

### 1. Verify Node.js and npm Installation
```powershell
node --version
npm --version
```
**Expected Output:**
- Node.js: v22.12.0 (or similar LTS version)
- npm: 10.9.0 (or similar)

---

## 🧹 Step 1: Clean Up Project Files

### Delete macOS Artifacts
```powershell
cd "C:\Users\DELL Tac\Desktop\mobiledev"
Remove-Item -Recurse -Force "__MACOSX"
```
**Purpose:** Remove macOS zip extraction artifacts that are not needed on Windows.

---

## 📦 Step 2: Navigate to Project Directory

```powershell
cd "C:\Users\DELL Tac\Desktop\mobiledev\devMobile\jewelry_rn_app_starter"
```

---

## 🔄 Step 3: Update Expo SDK from 52 to 54

### Issue: Expo Go app requires SDK 54, but project was configured for SDK 52

### Fix 1: Update app.json
**File:** `devMobile/jewelry_rn_app_starter/app.json`
```json
{
  "expo": {
    "sdkVersion": "54.0.0"  // Changed from "52.0.0"
  }
}
```

### Fix 2: Update package.json
**File:** `devMobile/jewelry_rn_app_starter/package.json`
```json
{
  "dependencies": {
    "expo": "~54.0.0"  // Changed from "~52.0.0"
  }
}
```

---

## 📥 Step 4: Install Missing Babel Preset

### Error: `Cannot find module 'babel-preset-expo'`

### Solution:
```powershell
npm install --save-dev babel-preset-expo
```

---

## 🔧 Step 5: Fix Dependency Version Mismatches

### Error: Multiple package version mismatches with SDK 54

### Solution: Use Expo's dependency checker and fixer
```powershell
# Check for issues
npx expo-doctor

# Fix dependencies automatically
npx expo install --fix
```

**Note:** This command may fail due to peer dependency conflicts. If it does, proceed to Step 6.

---

## 🔄 Step 6: Resolve Peer Dependency Conflicts

### Error: `ERESOLVE could not resolve` (peer dependency conflicts)

### Solution: Install with legacy peer deps flag
```powershell
npm install --legacy-peer-deps
```

This installs all dependencies even with peer dependency warnings, which is safe for Expo projects.

---

## 🗑️ Step 7: Remove Unnecessary Type Definitions

### Error: `@types/react-native` should not be installed directly

### Solution:
```powershell
npm uninstall @types/react-native --legacy-peer-deps
```

**Reason:** Type definitions are included with the `react-native` package itself.

### Update package.json
**File:** `devMobile/jewelry_rn_app_starter/package.json`
```json
{
  "devDependencies": {
    "@types/react": "~19.1.10",  // Updated from "~18.3.12"
    // Removed: "@types/react-native": "0.73.0"
  }
}
```

---

## 📦 Step 8: Install Missing Worklets Dependencies

### Error 1: `Cannot find module 'react-native-worklets/plugin'`

### Solution 1: Install react-native-worklets-core
```powershell
npm install react-native-worklets-core --legacy-peer-deps
```

### Error 2: Still missing `react-native-worklets/plugin`

### Solution 2: Install react-native-worklets
```powershell
npm install react-native-worklets --legacy-peer-deps
```

---

## 🔧 Step 9: Fix Worklets Version Mismatch

### Error: `WorkletsError: Mismatch between JavaScript part and native part of Worklets (0.6.1 vs 0.5.1)`

**Root Cause:** Expo Go SDK 54 has `react-native-worklets` version 0.5.1 built-in, but we installed 0.6.1.

### Solution: Downgrade to match Expo Go
```powershell
npm install react-native-worklets@0.5.1 --legacy-peer-deps
```

**Important:** The JavaScript version must match the native version in Expo Go.

---

## ✅ Step 10: Final Verification

### Check project health
```powershell
npx expo-doctor
```

**Expected:** Most checks should pass (some warnings about .expo directory are normal).

---

## 🚀 Step 11: Start Development Server

### Clear cache and start
```powershell
npx expo start --clear
```

**Flags:**
- `--clear`: Clears Metro bundler cache for a fresh start

**Expected Output:**
- Metro bundler starting
- QR code displayed
- Options to:
  - Press `a` for Android emulator
  - Press `i` for iOS simulator
  - Scan QR code with Expo Go

---

## 📱 Step 12: Connect Your Phone

### Prerequisites:
1. **Install Expo Go** on your Redmi Note 13 Pro from Google Play Store
2. **Ensure same Wi-Fi:** Phone and PC must be on the same network

### Method 1: Scan QR Code (Recommended)
1. Open Expo Go app
2. Tap "Scan QR code"
3. Point camera at QR code in terminal
4. Wait for app to load

### Method 2: Manual URL Entry
1. In Expo Go, tap "Enter URL manually"
2. Enter the URL shown in terminal (e.g., `exp://192.168.x.x:8081`)
3. Tap "Connect"

---

## 📝 Summary of All Commands (Quick Reference)

```powershell
# 1. Navigate to project
cd "C:\Users\DELL Tac\Desktop\mobiledev\devMobile\jewelry_rn_app_starter"

# 2. Install babel preset
npm install --save-dev babel-preset-expo

# 3. Fix dependencies (may fail, that's okay)
npx expo install --fix

# 4. Install with legacy peer deps
npm install --legacy-peer-deps

# 5. Remove unnecessary types
npm uninstall @types/react-native --legacy-peer-deps

# 6. Install worklets dependencies
npm install react-native-worklets-core --legacy-peer-deps
npm install react-native-worklets --legacy-peer-deps

# 7. Fix worklets version mismatch
npm install react-native-worklets@0.5.1 --legacy-peer-deps

# 8. Start server
npx expo start --clear
```

---

## 🐛 Common Errors and Solutions

### Error: "Project is incompatible with this version of expo go"
**Solution:** Update SDK version in `app.json` and `package.json` to match Expo Go version.

### Error: "Cannot find module 'babel-preset-expo'"
**Solution:** `npm install --save-dev babel-preset-expo`

### Error: "ERESOLVE could not resolve"
**Solution:** Use `--legacy-peer-deps` flag with npm install.

### Error: "WorkletsError: Mismatch between JavaScript part and native part"
**Solution:** Install `react-native-worklets@0.5.1` to match Expo Go's native version.

### Error: "TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found"
**Solution:** Update all dependencies to SDK 54 compatible versions using `npx expo install --fix` and `npm install --legacy-peer-deps`.

---

## 📦 Final Package Versions (SDK 54 Compatible)

After all fixes, your `package.json` should have:

```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-reanimated": "~4.1.1",
    "react-native-worklets": "0.5.1",
    "react-native-worklets-core": "^0.5.1",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "expo-status-bar": "~3.0.8",
    "expo-asset": "~12.0.10",
    "@react-native-community/slider": "5.0.1"
  },
  "devDependencies": {
    "babel-preset-expo": "^54.0.7",
    "@types/react": "~19.1.10",
    "typescript": "^5.3.3"
  }
}
```

---

## ✅ Verification Checklist

- [x] Node.js and npm installed
- [x] Project directory navigated
- [x] SDK updated to 54
- [x] Babel preset installed
- [x] Dependencies updated to SDK 54 compatible versions
- [x] Peer dependency conflicts resolved
- [x] Unnecessary packages removed
- [x] Worklets dependencies installed
- [x] Worklets version matched to Expo Go (0.5.1)
- [x] Development server started successfully
- [x] QR code displayed
- [x] Phone connected via Expo Go
- [x] App loads without errors

---

## 🎯 Next Steps

1. **Test all screens** in the app
2. **Review `frontend_logic.md`** for project documentation
3. **Plan Java backend** based on API requirements
4. **Update API endpoints** in `src/services/api.ts` when backend is ready

---

## 📚 Additional Resources

- **Expo Documentation:** https://docs.expo.dev/
- **Expo SDK 54 Release Notes:** https://expo.dev/changelog/2024/12-05-sdk-54
- **React Native Reanimated:** https://docs.swmansion.com/react-native-reanimated/
- **Troubleshooting Guide:** https://docs.expo.dev/workflow/common-development-errors/

---

## 🔄 If You Need to Start Fresh

If you encounter issues and need to completely reset:

```powershell
# 1. Remove node_modules and lock file
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall everything
npm install --legacy-peer-deps

# 4. Fix worklets version
npm install react-native-worklets@0.5.1 --legacy-peer-deps

# 5. Start fresh
npx expo start --clear
```

---

**Last Updated:** After successful setup with Expo SDK 54
**Status:** ✅ Project is working and ready for development

