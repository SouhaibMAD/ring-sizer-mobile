// src/services/auth.ts
import { api, setAuthToken } from './api';

export type Role = 'vendor' | 'admin';

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
    role,
  });
  setAuthToken(data.token);
  return data;
}

export async function registerApi(userData: {
  email: string;
  password: string;
  role: Role;
  company?: string;
  siret?: string;
}) {
  const { data } = await api.post<LoginResponse>('/register', userData);
  setAuthToken(data.token);
  return data;
}

export async function logoutApi() {
  await api.post('/logout');
  setAuthToken(undefined);
}
