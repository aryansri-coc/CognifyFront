const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cogniback-production.up.railway.app';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private static getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const includeAuth = options.method !== 'POST' || !endpoint.includes('auth');

    console.log('[v0] API Request:', {
      method: options.method || 'GET',
      url,
      endpoint,
      includeAuth
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(includeAuth),
          ...(options.headers || {}),
        },
      });

      console.log('[v0] API Response:', {
        status: response.status,
        statusText: response.statusText,
        url,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        
        console.log('[v0] API Error Details:', {
          status: response.status,
          endpoint,
          error: errorData
        });
        
        return {
          success: false,
          error: errorData.message || errorData.error || 'Request failed',
        };
      }

      try {
        const data = await response.json();
        console.log('[v0] API Success:', data);
        return {
          success: true,
          data: data.data || data,
        };
      } catch {
        return {
          success: true,
          data: {} as T,
        };
      }
    } catch (err) {
      console.log('[v0] Network Error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network request failed',
      };
    }
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  static async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/api/auth/login', { email, password });
  }

  static async register(email: string, password: string, name: string): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/api/auth/register', { email, password, name });
  }

  static async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return this.post('/api/auth/forgot-password', { email });
  }

  static async resetPassword(token: string, password: string): Promise<ApiResponse<any>> {
    return this.post('/api/auth/reset-password', { token, password });
  }

  // User Profile endpoints
  static async getProfile(): Promise<ApiResponse<any>> {
    return this.get('/api/user/me');
  }

  static async updateProfile(data: { name?: string; age?: number; sex?: string }): Promise<ApiResponse<any>> {
    return this.patch('/api/user/me', data);
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    return this.post('/api/auth/change-password', { currentPassword, newPassword });
  }

  static async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // Health endpoints
  static async syncHealth(data: {
    heartRate: number;
    sleepHours: number;
    stepsCount: number;
    date: string;
    bloodPressureSys?: number;
    bloodPressureDia?: number;
    glucose?: number;
    weight?: number;
  }): Promise<ApiResponse<any>> {
    const payload = {
      date: data.date,
      vitals: {
        heartRateAvg: data.heartRate,
        steps: data.stepsCount,
        bloodOxygenAvg: 98, // Default fallback
        hrvSdnnMs: 45,     // Default fallback
      },
      bloodPressure: {
        systolic: data.bloodPressureSys,
        diastolic: data.bloodPressureDia,
      },
      measurements: {
        glucose: data.glucose,
        weight: data.weight,
      },
      sleep: {
        totalHours: data.sleepHours,
      }
    };
    return this.post('/api/health/sync', payload);
  }

  static async getHealthData(): Promise<ApiResponse<any>> {
    return this.get('/api/health/history');
  }

  static async getLatestHealth(): Promise<ApiResponse<any>> {
    return this.get('/api/health/latest');
  }

  // Reports endpoints
  static async getReports(): Promise<ApiResponse<any>> {
    return this.get('/api/reports');
  }

  static async generateReport(type: 'weekly' | 'fortnightly'): Promise<ApiResponse<any>> {
    return this.post('/api/reports/generate', { type });
  }

  // Exercises endpoints
  static async getDailyExercises(): Promise<ApiResponse<any>> {
    return this.get('/api/v1/exercises/daily');
  }

  static async getExercise(exerciseId: string): Promise<ApiResponse<any>> {
    return this.get(`/api/v1/exercises/${exerciseId}`);
  }

  static async submitExercise(exerciseId: string, score: number): Promise<ApiResponse<any>> {
    return this.post('/api/v1/exercises/submit', { exerciseId, score });
  }

  // Medicine endpoints
  static async addMedicineReminder(data: {
    name: string;
    dosage?: string;
    frequency?: string;
    time?: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/api/medicine/reminder', data);
  }

  static async getMedicineReminders(): Promise<ApiResponse<any>> {
    return this.get('/api/medicine/reminders');
  }

  static async updateMedicineStatus(id: string, status: string): Promise<ApiResponse<any>> {
    return this.put(`/api/medicine/reminder/${id}/status`, { status });
  }

  // Emergency contacts endpoints
  static async addEmergencyContact(data: {
    name: string;
    phoneNumber: string;
    relationship?: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/api/emergency/contact', data);
  }

  static async getEmergencyContacts(): Promise<ApiResponse<any>> {
    return this.get('/api/emergency/contacts');
  }

  // Caregiver endpoints
  static async addCaregiver(data: {
    name: string;
    specialty?: string;
    email?: string;
    phoneNumber?: string;
    hospitalName?: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/api/caregiver/add', data);
  }

  static async getCaregiverPatients(): Promise<ApiResponse<any>> {
    return this.get('/api/caregiver/patients');
  }

  static async getCaregivers(): Promise<ApiResponse<any>> {
    return this.get('/api/caregivers');
  }

  static async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  static getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  static clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}
