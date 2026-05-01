import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserResponse,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8085/api/auth';
  private profileImage$ = new BehaviorSubject<string>('/images/user/owner.png');

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user_profile_image');
    if (stored) {
      this.profileImage$.next(stored);
    }
  }

  getProfileImage$(): Observable<string> {
    return this.profileImage$.asObservable();
  }

  // ── Register ──────────────────────────────────────────────
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request);
  }

  // ── Login ─────────────────────────────────────────────────
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request);
  }

  // ── Get current user ──────────────────────────────────────
  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ── Get All Users ─────────────────────────────────────────
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/all`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ── Get User by ID ────────────────────────────────────────
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ── Update Profile ────────────────────────────────────────
  updateProfile(id: number, request: UserResponse): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/profile/${id}`, request, {
      headers: this.getAuthHeaders(),
    });
  }

  // ── Upload Profile Image ──────────────────────────────────
  uploadProfileImage(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/profile/${userId}/image`, formData, {
      headers: this.getAuthHeadersWithoutContentType(),
    });
  }

  // ── Archive / Unarchive User ──────────────────────────────
  archiveUser(id: number): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/${id}/archive`, null, {
      headers: this.getAuthHeaders(),
    });
  }

  // ── Delete User ───────────────────────────────────────────
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ── Request Password Reset ────────────────────────────────
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/password-reset`, { email });
  }

  // ── Logout ────────────────────────────────────────────────
  logout(): Observable<string> {
    return this.http.post(`${this.baseUrl}/logout`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  // ── Token & User Helpers ──────────────────────────────────
  saveSession(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_id', response.id.toString());
    localStorage.setItem('user_role', response.roleName);
    localStorage.setItem('user_role_id', response.roleId.toString());
    localStorage.setItem('user_email', response.email);
    localStorage.setItem('user_name', `${response.firstName} ${response.lastName}`);
    // Clear old profile image so the previous user's photo doesn't persist
    localStorage.removeItem('user_profile_image');
    this.profileImage$.next('/images/user/owner.png');
  }

  saveProfileImageUrl(url: string): void {
    localStorage.setItem('user_profile_image', url);
    this.profileImage$.next(url);
  }

  getProfileImageUrl(): string | null {
    return localStorage.getItem('user_profile_image');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserRoleId(): number | null {
    const id = localStorage.getItem('user_role_id');
    return id ? parseInt(id, 10) : null;
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('user_id');
    return id ? parseInt(id, 10) : null;
  }

  removeSession(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_role_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_profile_image');
    this.profileImage$.next('/images/user/owner.png');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private getAuthHeadersWithoutContentType(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }
}
