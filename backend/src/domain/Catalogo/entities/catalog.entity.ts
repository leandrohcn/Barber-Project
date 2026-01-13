import { Catalogo as PrismaServiceType } from '@prisma/client';

export class Catalogo implements PrismaServiceType {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}
