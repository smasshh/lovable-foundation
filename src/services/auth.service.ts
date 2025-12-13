import { apiClient, tokenStorage, ApiError } from '@/lib/api-client';
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from '@/lib/auth-validation';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private user: User | null = null;

  constructor() {
    // Load user from localStorage on init
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  async login(data: LoginFormData): Promise<AuthResponse> {
    // Validate input
    const validated = loginSchema.parse(data);

    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      validated,
      { skipAuth: true }
    );

    this.setAuthData(response);
    return response;
  }

  async signup(data: SignupFormData): Promise<AuthResponse> {
    // Validate input
    const validated = signupSchema.parse(data);

    const response = await apiClient.post<AuthResponse>(
      '/auth/signup',
      {
        email: validated.email,
        password: validated.password,
      },
      { skipAuth: true }
    );

    this.setAuthData(response);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout errors, clear local state anyway
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    // Check if token is expired
    if (tokenStorage.isTokenExpired(token)) {
      this.clearAuthData();
      return null;
    }

    // Return cached user if available
    if (this.user) return this.user;

    try {
      const user = await apiClient.get<User>('/auth/me');
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        this.clearAuthData();
      }
      return null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email }, { skipAuth: true });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password }, { skipAuth: true });
  }

  isAuthenticated(): boolean {
    const token = tokenStorage.getAccessToken();
    if (!token) return false;
    return !tokenStorage.isTokenExpired(token);
  }

  getUser(): User | null {
    return this.user;
  }

  private setAuthData(response: AuthResponse): void {
    this.user = response.user;
    tokenStorage.setTokens(response.accessToken, response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  private clearAuthData(): void {
    this.user = null;
    tokenStorage.clearTokens();
  }
}

export const authService = new AuthService();
