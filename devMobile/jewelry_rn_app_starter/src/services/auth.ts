// src/services/auth.ts
import { api, setAuthToken } from './api';

export type Role = 'client' | 'vendor' | 'admin';

export interface ApiUser {
  id: number;
  email: string;
  role: Role;
  vendorId?: number | null;
}

export interface LoginResponse {
  user: ApiUser;
  token: string;
}

export async function loginApi(email: string, password: string, role?: Role) {
  const { data } = await api.post<LoginResponse>('/login', { 
    email, 
    password,
    role, // Send role to backend for validation
  });
  setAuthToken(data.token);
  return data;
}

export async function logoutApi() {
  await api.post('/logout');
  setAuthToken(undefined);
}
