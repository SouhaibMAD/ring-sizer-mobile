# React (Vite + shadcn) ➜ React Native (Expo) Migration Starter

This is a ready-to-run Expo React Native scaffold that mirrors your web app pages:
- Home, ProductDetail, GoldPrice, SizeCalculator, Auth, VendorDashboard, ProductManagement, AdminDashboard, VendorManagement

### Install
```bash
npm i -g expo
cd jewelry-rn-app
npm install
npm run start
```
Open in Expo Go on your phone or emulator.

### Libraries
- React Navigation (stack)
- NativeWind (Tailwind-like)
- lucide-react-native (icons)

### Porting Tips
- Replace DOM elements by RN primitives: `div` → `View`, `img` → `Image`, `input` → `TextInput`
- Replace `react-router-dom` with React Navigation.
- Replace shadcn/ui with simple RN primitives or a RN UI kit.
- Tailwind CSS → NativeWind classes (optional).

### Where to add logic
- `src/data/mockData.ts` for products
- API calls go in `src/services/*` (create this folder)
- Global auth/store: add Zustand or Context in `src/store/*`

