// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, Role, ApiUser } from '@/services/auth';
import { setAuthToken } from '@/services/api';

export interface User {
  id: number;
  email: string;
  role: Role;
  vendorId?: number | null;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restaure la session au démarrage
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [token, rawUser] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('auth_user'),
        ]);

        if (token && rawUser) {
          setAuthToken(token);
          const parsed: User = JSON.parse(rawUser);
          setUser(parsed);
        } else {
          setAuthToken(undefined);
        }
      } catch (e) {
        console.log('Auth bootstrap error', e);
        setAuthToken(undefined);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email: string, password: string, requestedRole?: Role) => {
    try {
      // Send requested role to backend for validation
      // Backend will check if user's actual role matches requested role
      const res = await loginApi(email, password, requestedRole);
      const apiUser: ApiUser = res.user;

      const mappedUser: User = {
        id: apiUser.id,
        email: apiUser.email,
        role: apiUser.role, // Use actual role from backend
        vendorId: apiUser.vendorId != null ? apiUser.vendorId : undefined
      };

      setUser(mappedUser);
      setAuthToken(res.token);

      await Promise.all([
        AsyncStorage.setItem('auth_token', res.token),
        AsyncStorage.setItem('auth_user', JSON.stringify(mappedUser)),
      ]);
    } catch (error: any) {
      // Re-throw the error so AuthScreen can handle it
      // Axios errors have response.data.message
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setAuthToken(undefined);
    await Promise.all([
      AsyncStorage.removeItem('auth_token'),
      AsyncStorage.removeItem('auth_user'),
    ]);
    // tu pourras plus tard appeler /api/logout côté Laravel
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};

export type { Role };
