import { Injectable, Inject } from '@nestjs/common';
import type { IDashboardRepository } from './repository/dashboard.repository.interface';


@Injectable()
export class DashboardService {
    constructor(
        @Inject('IDashboardRepository') private dashboardRepository: IDashboardRepository,
    ) {}

    async getMetricaDiaria(organizationId: string) {
        return this.dashboardRepository.getMetricaDiaria(organizationId);
    }
}
