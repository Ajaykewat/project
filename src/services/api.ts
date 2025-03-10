import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { encrypt, decrypt } from './encryption';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Encrypt request data if present
        if (config.data) {
          config.data = {
            encryptedData: encrypt(config.data)
          };
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        // Decrypt response data if encrypted
        if (response.data?.encryptedData) {
          response.data = decrypt(response.data.encryptedData);
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AxiosResponse> {
    return this.api.post('/users/login', { email, password });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/users/register', userData);
  }

  async forgotPassword(email: string): Promise<AxiosResponse> {
    return this.api.post('/users/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<AxiosResponse> {
    return this.api.post(`/users/reset-password/${token}`, { password });
  }

  async verifyEmail(token: string): Promise<AxiosResponse> {
    return this.api.get(`/users/verify-email/${token}`);
  }

  // Monthly goals endpoints
  async createMonthlyGoal(goalData: {
    amount: number;
    month: string;
    year: number;
  }): Promise<AxiosResponse> {
    return this.api.post('/monthly-goals', goalData);
  }

  async getCurrentMonthGoal(): Promise<AxiosResponse> {
    return this.api.get('/monthly-goals/current');
  }

  async getAllGoals(): Promise<AxiosResponse> {
    return this.api.get('/monthly-goals');
  }

  async updateMonthlyGoal(id: string, amount: number): Promise<AxiosResponse> {
    return this.api.put(`/monthly-goals/${id}`, { amount });
  }

  // Generic request method for custom endpoints
  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api(config);
  }
}

export const apiService = ApiService.getInstance();