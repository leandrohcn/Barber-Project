import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { User } from './entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto){
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role.toString(), 
      },
    });
    return new User(user);
  }

  findAll() {
    return this.prisma.user.findMany()
    .then(users => users.map(user => new User(user)));
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } })
    .then(user => user ? new User(user) : null);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        role: updateUserDto.role?.toString(),
      }
    })
    .then(user => new User(user));
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    })
    .then(user => new User(user));
  }
}
