import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardMapper {
  toResponse(data: any): any {
    return data;
  }
}
