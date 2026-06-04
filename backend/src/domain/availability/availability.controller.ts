import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  /**
   * GET /availability/:funcionarioId?date=2024-06-10&organizationId=xxx
   * Retorna horários disponíveis para um funcionário em uma data específica
   */
  @Get(':funcionarioId')
  async getAvailability(
    @Param('funcionarioId') funcionarioId: string,
    @Query('date') date: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.availabilityService.getAvailability(
      funcionarioId,
      date,
      organizationId,
    );
  }
}
