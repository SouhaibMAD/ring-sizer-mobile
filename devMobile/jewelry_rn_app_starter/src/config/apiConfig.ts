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

// ⚠️ UPDATE THIS with your computer's local IP address when testing on physical device
// Your Expo address says 192.168.1.6, so we use that.
const LOCAL_IP = '192.168.1.6'; 

const API_PORT = 8000;

function getApiBaseUrl(): string {
  try {
    // Option 1: Use environment variable if set (for production/staging)
    if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }

    // Option 2: Use configured local IP
    const baseUrl = `http://${LOCAL_IP}:${API_PORT}/api`;
    return baseUrl;
  } catch (error) {
    // Fallback to default
    return `http://${LOCAL_IP}:${API_PORT}/api`;
  }
}

export const API_BASE_URL = getApiBaseUrl();
