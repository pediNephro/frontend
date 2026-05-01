// =============================================
// Microservice 1 — Auth / User Models
// =============================================

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  roleName: string; // 'ADMIN' | 'DOCTOR' | 'NURSE'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  roleId: number;
  token: string;
  status: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  roleName: string;
  roleId: number;
  status: string;
}
