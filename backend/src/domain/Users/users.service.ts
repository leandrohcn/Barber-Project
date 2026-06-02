import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { IUsersRepository } from './repository/users.repository.interface';
import type { users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository') private usersRepository: IUsersRepository,
  ) {}

  async create(organizationId: string, createUserDto: CreateUserDto): Promise<users> {
    return this.usersRepository.create(organizationId, createUserDto);
  }

  async findAll(organizationId: string): Promise<users[]> {
    return this.usersRepository.findAll(organizationId);
  }

  async findOne(organizationId: string, id: string): Promise<users> {
    const user = await this.usersRepository.findOne(organizationId, id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<users | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(organizationId: string, id: string, updateUserDto: UpdateUserDto): Promise<users> {
    await this.findOne(organizationId, id);
    return this.usersRepository.update(organizationId, id, updateUserDto);
  }

  async updatePassword(organizationId: string, id: string, newPassword: string): Promise<users> {
    await this.findOne(organizationId, id);
    return this.usersRepository.updatePassword(organizationId, id, newPassword);
  }

  async deactivate(organizationId: string, id: string): Promise<users> {
    await this.findOne(organizationId, id);
    return this.usersRepository.deactivate(organizationId, id);
  }

  async remove(organizationId: string, id: string): Promise<users> {
    await this.findOne(organizationId, id);
    return this.usersRepository.delete(organizationId, id);
  }
}