# Windows Setup Guide - Jewelry React Native App

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed on your Windows PC:

### 1. Node.js and npm
- **Download:** https://nodejs.org/ (LTS version recommended)
- **Verify installation:**
  ```powershell
  node --version
  npm --version
  ```
- Should show versions like `v20.x.x` and `10.x.x`

### 2. Git (Optional but recommended)
- **Download:** https://git-scm.com/download/win
- **Verify:**
  ```powershell
  git --version
  ```

### 3. Expo CLI (Global Installation)
```powershell
npm install -g expo-cli
```

Or use npx (no global install needed):
```powershell
npx expo-cli --version
```

### 4. Expo Go App on Your Phone
- **Android:** Install from Google Play Store
- **iOS:** Install from App Store
- Make sure your phone and PC are on the **same Wi-Fi network**

---

## 🧹 Step 1: Clean Up Project Files

### Files/Folders to DELETE:

1. **`__MACOSX` folder** (macOS zip artifacts - completely useless on Windows)
   ```powershell
   Remove-Item -Recurse -Force "__MACOSX"
   ```

2. **Root `HomeScreen.tsx`** (if you want to use the project version)
   - The root `HomeScreen.tsx` has more features (search, filters, sorting)
   - The project version (`src/screens/HomeScreen.tsx`) uses API calls
   - **Decision:** Keep the root version if you want advanced features, or delete it if you prefer the API version

### Files/Folders to KEEP:

- `devMobile/jewelry_rn_app_starter/` - Main React Native project
- `devMobile/jewelry-api/` - Laravel backend (reference, but you'll build Java backend)
- `frontend_logic.md` - Documentation (just created)
- `WINDOWS_SETUP_GUIDE.md` - This file

---

## 🚀 Step 2: Navigate to Project Directory

Open PowerShell or Command Prompt and navigate to the React Native project:

```powershell
cd "C:\Users\DELL Tac\Desktop\mobiledev\devMobile\jewelry_rn_app_starter"
```

---

## 📦 Step 3: Install Dependencies

```powershell
npm install
```

This will install all packages listed in `package.json`. This may take 5-10 minutes.

**If you encounter errors:**
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure you have a stable internet connection
- Some packages may require Visual Studio Build Tools (Windows will prompt you)

---

## ⚙️ Step 4: Configure for Windows/Android

### Update API Base URL (if needed)

The app is currently configured to connect to `http://127.0.0.1:8000/api` (Laravel backend).

**For testing without backend:**
- The app uses mock data for some screens
- You can test the UI without a backend

**For connecting to a backend:**
- Edit `src/services/api.ts`
- Change `BASE_URL` to your backend URL
- For physical device testing, use your PC's local IP address (see below)

### Get Your PC's Local IP Address

When testing on a physical device (Redmi Note 13 Pro), you need to use your PC's IP address instead of `127.0.0.1`.

**Find your IP:**
```powershell
ipconfig
```

Look for "IPv4 Address" under your active network adapter (usually starts with `192.168.x.x` or `10.x.x.x`).

**Example:** If your IP is `192.168.1.100`, update:
```typescript
const BASE_URL = 'http://192.168.1.100:8000/api';
```

**Important:** Make sure Windows Firewall allows connections on port 8000 (or your backend port).

---

## 📱 Step 5: Start the Development Server

### Option A: Using Expo CLI (Recommended)

```powershell
npx expo start
```

Or if you installed globally:
```powershell
expo start
```

### Option B: Using npm script

```powershell
npm start
```

### What You'll See:

1. A QR code in the terminal
2. Options to:
   - Press `a` to open Android emulator
   - Press `i` to open iOS simulator (requires Mac)
   - Scan QR code with Expo Go app

---

## 📲 Step 6: Connect Your Redmi Note 13 Pro

### Method 1: Scan QR Code (Easiest)

1. Open **Expo Go** app on your phone
2. Tap **"Scan QR code"**
3. Point camera at the QR code in your terminal
4. The app will load on your phone

### Method 2: Enter URL Manually

1. In Expo Go app, tap **"Enter URL manually"**
2. Type the URL shown in terminal (e.g., `exp://192.168.1.100:8081`)
3. Tap **"Connect"**

### Troubleshooting Connection Issues:

**Problem: "Unable to connect"**
- **Solution 1:** Ensure phone and PC are on same Wi-Fi network
- **Solution 2:** Try using "Tunnel" mode:
  ```powershell
  npx expo start --tunnel
  ```
  (Slower but works across different networks)

**Problem: "Network request failed"**
- **Solution:** Check Windows Firewall settings
- Allow Node.js through firewall
- Or temporarily disable firewall for testing

**Problem: QR code not scanning**
- **Solution:** Use manual URL entry method
- Or try tunnel mode

---

## 🎯 Step 7: Test the App

Once connected, you should see:

1. **Home Screen** - Product list
2. **Bottom Tabs:**
   - Home (house icon)
   - Gold Price (dollar icon)
   - Size Calculator (ruler icon)
   - Account (user icon)

3. **Try these features:**
   - Browse products
   - Tap a product to see details
   - Check gold price screen
   - Use size calculator
   - Try login (will fail without backend, but UI works)

---

## 🔧 Common Issues and Solutions

### Issue 1: "Metro bundler failed to start"

**Solution:**
```powershell
# Clear cache
npx expo start --clear

# Or delete cache manually
Remove-Item -Recurse -Force node_modules\.cache
```

### Issue 2: "Port 8081 already in use"

**Solution:**
```powershell
# Kill process on port 8081
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F

# Or use different port
npx expo start --port 8082
```

### Issue 3: "Module not found" errors

**Solution:**
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue 4: TypeScript errors

**Solution:**
```powershell
# Check TypeScript version
npm list typescript

# Reinstall TypeScript if needed
npm install --save-dev typescript@^5.3.3
```

### Issue 5: App crashes on phone

**Solution:**
- Check terminal for error messages
- Try clearing Expo Go app cache on phone
- Restart development server with `--clear` flag
- Check if all dependencies are installed correctly

---

## 🛠️ Development Workflow

### Making Changes

1. Edit files in `src/` directory
2. Save the file
3. Expo will automatically reload on your phone (Hot Reload)
4. If not, shake your phone and tap "Reload"

### Viewing Logs

- **Terminal:** Shows Metro bundler logs
- **Expo Go:** Shake phone → "Show Developer Menu" → "Debug Remote JS"
- **Chrome DevTools:** Can be opened for debugging

### Stopping the Server

Press `Ctrl + C` in the terminal to stop the development server.

---

## 📝 Next Steps

1. **Test all screens** to understand the app flow
2. **Review `frontend_logic.md`** for detailed documentation
3. **Plan Java backend** based on API requirements
4. **Update API endpoints** when Java backend is ready

---

## 🔗 Useful Commands

```powershell
# Start development server
npm start
# or
npx expo start

# Start with cache cleared
npx expo start --clear

# Start in tunnel mode (for different networks)
npx expo start --tunnel

# Run on Android emulator (if installed)
npm run android

# Check installed packages
npm list

# Update packages
npm update

# Check for outdated packages
npm outdated
```

---

## 📞 Getting Help

- **Expo Documentation:** https://docs.expo.dev/
- **Expo Forums:** https://forums.expo.dev/
- **React Native Docs:** https://reactnative.dev/

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Expo CLI installed (or using npx)
- [ ] Expo Go app installed on phone
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server started (`npx expo start`)
- [ ] Phone connected via Expo Go
- [ ] App loads successfully
- [ ] All screens accessible
- [ ] Ready for backend development!

---

**Good luck with your backend development! 🚀**

