import type { Opportunity, Application, StudentProfile, User, Notification, Role } from './definitions';

/**
 * Standard API client for frontend components calling backend Next.js API routes.
 */
class ApiClient {
  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data.data ?? data;
  }

  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; user: User }> {
    return this.fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<{ success: boolean }> {
    return this.fetchJson('/api/auth/logout', { method: 'POST' });
  }

  async signup(user: { name: string; email: string; password: string; role: Role }): Promise<{ success: boolean; user: User }> {
    return this.fetchJson('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Opportunities
  async getOpportunities(): Promise<Opportunity[]> {
    return this.fetchJson<Opportunity[]>('/api/opportunities');
  }

  async getOpportunity(id: string): Promise<Opportunity> {
    return this.fetchJson<Opportunity>(`/api/opportunities/${id}`);
  }

  async createOpportunity(opportunity: Omit<Opportunity, 'id' | 'postedAt'>): Promise<Opportunity> {
    return this.fetchJson<Opportunity>('/api/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunity),
    });
  }

  async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity> {
    return this.fetchJson<Opportunity>(`/api/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteOpportunity(id: string): Promise<{ success: boolean }> {
    return this.fetchJson<{ success: boolean }>(`/api/opportunities/${id}`, {
      method: 'DELETE',
    });
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return this.fetchJson<Application[]>('/api/applications');
  }

  async apply(opportunityId: string): Promise<Application> {
    return this.fetchJson<Application>('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ opportunityId }),
    });
  }

  // Profile
  async getProfile(userId?: string): Promise<StudentProfile> {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return this.fetchJson<StudentProfile>(`/api/profile${query}`);
  }

  async updateProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
    return this.fetchJson<StudentProfile>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Users
  async getUsersByRole(role: Role): Promise<User[]> {
    return this.fetchJson<User[]>(`/api/users?role=${role}`);
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return this.fetchJson<Notification[]>('/api/notifications');
  }

  async markNotificationsRead(): Promise<{ success: boolean }> {
    return this.fetchJson<{ success: boolean }>('/api/notifications', { method: 'PUT' });
  }
}

export const api = new ApiClient();
export default api;
