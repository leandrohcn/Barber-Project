export interface IDashboardRepository {
  getMetricaDiaria(organizationId: string): Promise<{
    faturamentoEsperado: number;
    faturamentoReal: number;
    cancelamentos: number;
    agendamentos: number;
  }>;
}
