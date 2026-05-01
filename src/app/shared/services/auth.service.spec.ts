import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../models/auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8085/api/auth';

  const mockAuthResponse: AuthResponse = {
    id: 1, firstName: 'Alice', lastName: 'Martin',
    email: 'alice@hospital.tn', roleName: 'DOCTOR',
    roleId: 2, token: 'jwt-token', status: 'ACTIVE'
  };

  const mockUserResponse: UserResponse = {
    id: 1, firstName: 'Alice', lastName: 'Martin',
    email: 'alice@hospital.tn', phoneNumber: '+21612345678',
    profileImageUrl: null, roleName: 'DOCTOR', roleId: 2, status: 'ACTIVE'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── register ──────────────────────────────────────────────

  it('register - should POST to /register and return AuthResponse', () => {
    const req: RegisterRequest = {
      firstName: 'Alice', lastName: 'Martin',
      email: 'alice@hospital.tn', password: 'secret',
      phoneNumber: '+21612345678', roleName: 'DOCTOR'
    };
    service.register(req).subscribe(res => {
      expect(res.email).toBe('alice@hospital.tn');
      expect(res.token).toBe('jwt-token');
    });
    const http = httpMock.expectOne(`${baseUrl}/register`);
    expect(http.request.method).toBe('POST');
    http.flush(mockAuthResponse);
  });

  // ── login ─────────────────────────────────────────────────

  it('login - should POST to /login and return AuthResponse', () => {
    const req: LoginRequest = { email: 'alice@hospital.tn', password: 'secret' };
    service.login(req).subscribe(res => {
      expect(res.token).toBe('jwt-token');
      expect(res.roleName).toBe('DOCTOR');
    });
    const http = httpMock.expectOne(`${baseUrl}/login`);
    expect(http.request.method).toBe('POST');
    http.flush(mockAuthResponse);
  });

  // ── getCurrentUser ────────────────────────────────────────

  it('getCurrentUser - should GET /me with Authorization header', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    service.getCurrentUser().subscribe(res => {
      expect(res.email).toBe('alice@hospital.tn');
    });
    const http = httpMock.expectOne(`${baseUrl}/me`);
    expect(http.request.method).toBe('GET');
    expect(http.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    http.flush(mockUserResponse);
  });

  // ── getAllUsers ───────────────────────────────────────────

  it('getAllUsers - should GET /all and return array', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    service.getAllUsers().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].email).toBe('alice@hospital.tn');
    });
    const http = httpMock.expectOne(`${baseUrl}/all`);
    expect(http.request.method).toBe('GET');
    http.flush([mockUserResponse]);
  });

  // ── getUserById ───────────────────────────────────────────

  it('getUserById - should GET /1 with correct ID', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    service.getUserById(1).subscribe(res => {
      expect(res.id).toBe(1);
    });
    const http = httpMock.expectOne(`${baseUrl}/1`);
    expect(http.request.method).toBe('GET');
    http.flush(mockUserResponse);
  });

  // ── updateProfile ─────────────────────────────────────────

  it('updateProfile - should PUT /profile/1 with updated data', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    service.updateProfile(1, mockUserResponse).subscribe(res => {
      expect(res.firstName).toBe('Alice');
    });
    const http = httpMock.expectOne(`${baseUrl}/profile/1`);
    expect(http.request.method).toBe('PUT');
    http.flush(mockUserResponse);
  });

  // ── archiveUser ───────────────────────────────────────────

  it('archiveUser - should PUT /1/archive', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    const archived = { ...mockUserResponse, status: 'ARCHIVED' };
    service.archiveUser(1).subscribe(res => {
      expect(res.status).toBe('ARCHIVED');
    });
    const http = httpMock.expectOne(`${baseUrl}/1/archive`);
    expect(http.request.method).toBe('PUT');
    http.flush(archived);
  });

  // ── deleteUser ────────────────────────────────────────────

  it('deleteUser - should DELETE /1', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    service.deleteUser(1).subscribe();
    const http = httpMock.expectOne(`${baseUrl}/1`);
    expect(http.request.method).toBe('DELETE');
    http.flush({});
  });

  // ── logout ────────────────────────────────────────────────

  it('logout - should POST to /logout', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    service.logout().subscribe(res => {
      expect(res).toBe('Logout successful');
    });
    const http = httpMock.expectOne(`${baseUrl}/logout`);
    expect(http.request.method).toBe('POST');
    http.flush('Logout successful');
  });

  // ── requestPasswordReset ──────────────────────────────────

  it('requestPasswordReset - should POST to /password-reset', () => {
    service.requestPasswordReset('alice@hospital.tn').subscribe();
    const http = httpMock.expectOne(`${baseUrl}/password-reset`);
    expect(http.request.method).toBe('POST');
    expect(http.request.body).toEqual({ email: 'alice@hospital.tn' });
    http.flush({});
  });

  // ── saveSession / getToken / getUserRole ──────────────────

  it('saveSession - should store all fields in localStorage', () => {
    service.saveSession(mockAuthResponse);
    expect(localStorage.getItem('auth_token')).toBe('jwt-token');
    expect(localStorage.getItem('user_role')).toBe('DOCTOR');
    expect(localStorage.getItem('user_id')).toBe('1');
    expect(localStorage.getItem('user_name')).toBe('Alice Martin');
  });

  it('getToken - should return token from localStorage', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    expect(service.getToken()).toBe('jwt-token');
  });

  it('getToken - should return null if no token', () => {
    expect(service.getToken()).toBeNull();
  });

  it('getUserRole - should return role from localStorage', () => {
    localStorage.setItem('user_role', 'DOCTOR');
    expect(service.getUserRole()).toBe('DOCTOR');
  });

  it('getUserId - should parse and return user ID', () => {
    localStorage.setItem('user_id', '42');
    expect(service.getUserId()).toBe(42);
  });

  it('getUserId - should return null when not set', () => {
    expect(service.getUserId()).toBeNull();
  });

  it('isLoggedIn - should return true when token exists', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('isLoggedIn - should return false when no token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('removeSession - should clear all localStorage keys', () => {
    service.saveSession(mockAuthResponse);
    service.removeSession();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('user_role')).toBeNull();
    expect(localStorage.getItem('user_id')).toBeNull();
  });

  // ── profileImage$ ─────────────────────────────────────────

  it('getProfileImage$ - should emit default image initially', (done) => {
    service.getProfileImage$().subscribe(url => {
      expect(url).toBe('/images/user/owner.png');
      done();
    });
  });

  it('saveProfileImageUrl - should update profileImage$ observable', (done) => {
    service.saveProfileImageUrl('https://cloudinary.com/img.jpg');
    service.getProfileImage$().subscribe(url => {
      expect(url).toBe('https://cloudinary.com/img.jpg');
      done();
    });
  });

  it('getUserRoleId - should parse and return roleId', () => {
    localStorage.setItem('user_role_id', '2');
    expect(service.getUserRoleId()).toBe(2);
  });

  it('getUserName - should return stored user name', () => {
    localStorage.setItem('user_name', 'Alice Martin');
    expect(service.getUserName()).toBe('Alice Martin');
  });
});
