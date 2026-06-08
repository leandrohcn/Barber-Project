import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.access_token) {
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      // Armazenar também em cookie para middleware acessar
      if (typeof document !== 'undefined') {
        document.cookie = `token=${token}; path=/; max-age=86400`; // 24 horas
      }
    }
    return response.data;
  }

  async register(data: { organizationName: string; email: string; password: string; name: string }) {
    return this.client.post('/auth/register', data);
  }

  async registerWithInvite(data: { inviteToken: string; password: string; name: string; phone?: string }) {
    const response = await this.client.post('/auth/register-with-invite', data);
    if (response.data.access_token) {
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      if (typeof document !== 'undefined') {
        document.cookie = `token=${token}; path=/; max-age=86400`;
      }
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    // Remover cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; path=/; max-age=0';
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Staff
  async completeStaffProfile(data: { name: string; phone?: string }) {
    return this.client.post('/staff/me/complete-profile', data);
  }

  async getStaffDashboard() {
    return this.client.get('/staff/me/dashboard');
  }

  async getStaffAgendamentos() {
    return this.client.get('/staff/me/agendamentos');
  }

  // Dashboard
  async getDashboard() {
    return this.client.get('/dashboard');
  }

  async getOwnerDashboard() {
    return this.client.get('/dashboard/metrica');
  }

  // Agendamentos
  async getAgendamentos(organizationId: string) {
    return this.client.get(`/agendamentos`, {
      params: { organizationId },
    });
  }

  async createAgendamento(data: any) {
    return this.client.post('/agendamentos', data);
  }

  // Catálogos
  async getCatalogs(organizationId: string) {
    return this.client.get(`/catalogs`, {
      params: { organizationId },
    });
  }

  async createCatalog(data: any) {
    return this.client.post('/catalogs', data);
  }

  async updateCatalog(id: string, data: any) {
    return this.client.put(`/catalogs/${id}`, data);
  }

  async deleteCatalog(id: string) {
    return this.client.delete(`/catalogs/${id}`);
  }

  // Users/Clientes
  async getUsers(organizationId: string) {
    return this.client.get(`/users`, {
      params: { organizationId },
    });
  }

  // Funcionários
  async getFuncionarios() {
    return this.client.get('/funcionarios');
  }

  async createFuncionario(data: any) {
    return this.client.post('/funcionarios', data);
  }

  async updateFuncionario(id: string, data: any) {
    return this.client.put(`/funcionarios/${id}`, data);
  }

  async deleteFuncionario(id: string) {
    return this.client.delete(`/funcionarios/${id}`);
  }

  async deactivateFuncionario(id: string) {
    return this.client.post(`/funcionarios/${id}/deactivate`);
  }

  // Invites
  async generateInvite(email: string) {
    return this.client.post('/invites/generate', { email });
  }

  async validateInvite(token: string) {
    return this.client.get(`/invites/validate/${token}`);
  }

  // Organizations
  async getOrganization(organizationId: string) {
    return this.client.get(`/organizations/${organizationId}`);
  }

  async updateOrganization(organizationId: string, data: any) {
    return this.client.put(`/organizations/${organizationId}`, data);
  }

  // Horários
  async getHorarios() {
    return this.client.get('/horarios');
  }

  async getMeAsStaff() {
    return this.client.get('/horarios/me/staff');
  }

  async getHorariosByFuncionario(funcionarioId: string) {
    return this.client.get(`/horarios/funcionario/${funcionarioId}`);
  }

  async createHorario(data: any) {
    return this.client.post('/horarios', data);
  }

  async upsertHorariosBatch(funcionarioId: string, horarios: any[]) {
    return this.client.post('/horarios/upsert/batch', {
      funcionarioId,
      horarios,
    });
  }

  async updateHorario(id: string, data: any) {
    return this.client.put(`/horarios/${id}`, data);
  }

  async deleteHorario(id: string) {
    return this.client.delete(`/horarios/${id}`);
  }
}

export const api = new ApiClient();
