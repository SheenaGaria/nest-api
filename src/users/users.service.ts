import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string | number) {
    const user = await this.repo.findOne({ where: { id: +id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string | number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: string | number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { deleted: true, id };
  }

  // Added for AuthService
  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
