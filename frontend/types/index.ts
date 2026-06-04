// Organizations
export interface Organization {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  customDomain?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt: string;
  updatedAt: string;
}

// Users
export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// Catalogs (Services)
export interface Catalog {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Funcionários (Professionals)
export interface Funcionario {
  id: string;
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  createdAt: string;
  updatedAt: string;
}

// Horários
export type DayOfWeek = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB' | 'DOM';

export interface Horario {
  id: string;
  organizationId: string;
  funcionarioId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  createdAt: string;
  updatedAt: string;
}

// Agendamentos (Appointments)
export type AgendamentoStatus = 
  | 'PENDENTE' 
  | 'CONFIRMADO' 
  | 'EM_ANDAMENTO' 
  | 'CONCLUIDO' 
  | 'CANCELADO' 
  | 'NAO_COMPARECEU';

export interface Agendamento {
  id: string;
  organizationId: string;
  catalogId: string;
  funcionarioId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  startTime: string;
  endTime: string;
  status: AgendamentoStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Notificações
export type NotificationType = 'SMS' | 'EMAIL' | 'WHATSAPP';
export type NotificationStatus = 'PENDENTE' | 'ENVIADO' | 'FALHA';

export interface Notificacao {
  id: string;
  organizationId: string;
  agendamentoId: string;
  type: NotificationType;
  status: NotificationStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard
export interface DashboardMetrics {
  appointmentsToday: number;
  appointmentsThisMonth: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  averageRating: number;
}
