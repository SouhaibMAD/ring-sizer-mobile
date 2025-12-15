// src/config/apiConfig.ts
/**
 * API Configuration
 * 
 * IMPORTANT: For physical devices, you MUST use your computer's local IP address
 * instead of 127.0.0.1 or localhost.
 * 
 * To find your IP address:
 * - Windows: Run 'ipconfig' in PowerShell/CMD, look for "IPv4 Address"
 * - Mac/Linux: Run 'ifconfig' or 'ip addr', look for inet address
 * 
 * Common formats: 192.168.x.x or 10.x.x.x
 * 
 * Update the LOCAL_IP constant below with your actual IP address.
 */

import { Platform } from 'react-native';

// ⚠️ UPDATE THIS with your computer's local IP address when testing on physical device
// Example: '192.168.1.100' or '10.0.0.5'
// For Android Emulator, we'll try 10.0.2.2 first, then fallback to this IP
// For iOS Simulator, use '127.0.0.1' (automatically detected)
// For physical device, set your computer's local IP here
// NOTE: Use your main network adapter IP (not VirtualBox adapter like 192.168.56.1)
const PHYSICAL_DEVICE_IP = '10.180.45.84'; // Change this to your computer's main network IP

const API_PORT = 8000;

function getApiBaseUrl(): string {
  try {
    // Option 1: Use environment variable if set (for production/staging)
    if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }

    // Option 2: Auto-detect based on platform
    let host: string;
    if (__DEV__) {
      // Development mode - use platform-specific localhost
      if (Platform.OS === 'android') {
        // Android emulator on Windows: Use local IP address (more reliable)
        // Standard Android emulator uses 10.0.2.2, but on Windows it often doesn't work
        // You can override with EXPO_PUBLIC_ANDROID_EMULATOR_IP environment variable
        // To use 10.0.2.2 instead, set: EXPO_PUBLIC_ANDROID_EMULATOR_IP=10.0.2.2
        host = process.env?.EXPO_PUBLIC_ANDROID_EMULATOR_IP || PHYSICAL_DEVICE_IP;
      } else if (Platform.OS === 'ios') {
        // iOS simulator can use localhost
        host = '127.0.0.1';
      } else {
        // Web or other platforms
        host = '127.0.0.1';
      }
    } else {
      // Production - use physical device IP or environment variable
      host = PHYSICAL_DEVICE_IP;
    }

    const baseUrl = `http://${host}:${API_PORT}/api`;
    console.log(`🌐 API Base URL: ${baseUrl} (Platform: ${Platform.OS})`);
    return baseUrl;
  } catch (error) {
    // Fallback to default
    const fallbackUrl = `http://127.0.0.1:${API_PORT}/api`;
    console.log(`🌐 API Base URL (fallback): ${fallbackUrl}`);
    return fallbackUrl;
  }
}

export const API_BASE_URL = getApiBaseUrl();

