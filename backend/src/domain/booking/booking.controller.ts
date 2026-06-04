import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Booking (Public)')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * GET /booking/services/:organizationId
   * Listar serviços públicos de uma organização
   */
  @Get('services/:organizationId')
  async getServices(@Param('organizationId') organizationId: string) {
    return this.bookingService.getServices(organizationId);
  }

  /**
   * GET /booking/professionals/:organizationId
   * Listar profissionais ativos de uma organização
   */
  @Get('professionals/:organizationId')
  async getProfessionals(@Param('organizationId') organizationId: string) {
    return this.bookingService.getProfessionals(organizationId);
  }

  /**
   * POST /booking/create
   * Criar agendamento (cliente anônimo)
   */
  @Post('create')
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }
}
