import { catalogs as PrismaCatalogo } from '@prisma/client';

export class Catalogo implements PrismaCatalogo {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  price: any;
  duration: number;
  image: string | null;
  isAtivo: boolean;
  ordem: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: Partial<PrismaCatalogo>) {
    Object.assign(this, data);
  }
}
