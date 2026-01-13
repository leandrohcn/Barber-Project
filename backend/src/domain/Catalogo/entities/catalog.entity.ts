import { Service as PrismaServiceType } from '@prisma/client';

export class Service implements PrismaServiceType {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}
