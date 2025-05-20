import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

// Ensure the URL is properly constructed
const API_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');

console.log('API_URL:', API_URL); // Debug log

interface User {
  id: string;
  email: string;
  username: string;
  address: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

class AuthStore {
  user: User | null = null;
  accessToken: string | null = null;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'AuthStore',
      properties: ['user', 'accessToken', 'isAuthenticated'],
      storage: window.localStorage,
    });
  }

  async login(email: string, password: string) {
    try {
      this.isLoading = true;
      this.error = null;

      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      formData.append("grant_type", "password");

      const loginUrl = `${API_URL}/auth/jwt/login`;
      console.log('Login URL:', loginUrl); // Debug log

      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!loginResponse.ok) {
        throw new Error("Login failed");
      }

      const { access_token } = await loginResponse.json();

      const userUrl = `${API_URL}/users/me`;
      console.log('User URL:', userUrl); // Debug log

      const userResponse = await fetch(userUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();

      runInAction(() => {
        this.user = userData;
        this.accessToken = access_token;
        this.isAuthenticated = true;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'An error occurred';
        this.isLoading = false;
      });
    }
  }

  async register(userData: Omit<User, 'id'> & { password: string }) {
    try {
      this.isLoading = true;
      this.error = null;

      const registerUrl = `${API_URL}/auth/register`;
      console.log('Register URL:', registerUrl); // Debug log

      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      // After successful registration, automatically log in the user
      await this.login(userData.email, userData.password);
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'An error occurred';
        this.isLoading = false;
      });
    }
  }

  logout() {
    runInAction(() => {
      this.user = null;
      this.accessToken = null;
      this.isAuthenticated = false;
      this.error = null;
    });
  }

  clearError() {
    this.error = null;
  }
}

export const authStore = new AuthStore(); 