import { Injectable } from '@nestjs/common';
import type { catalogs } from '@prisma/client';

@Injectable()
export class CatalogMapper {
  toDomain(raw: any): catalogs {
    return raw as catalogs;
  }

  toResponse(catalogo: catalogs): catalogs {
    return catalogo;
  }
}
