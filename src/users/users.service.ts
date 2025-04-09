import {
  Injectable,
  // NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';

import { UserResponse } from './interfaces/user-response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existUsers = await this.findByEmail(email);

    if (existUsers) {
      throw new BadRequestException(`user with${email} exist`);
    }

    return await this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find({});
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return {
        user: null,
        message: 'user not found',
        error: 'Not Found',
        statusCode: 404,
      };
    }

    return {
      user,
      message: 'ok',
      error: null,
      statusCode: 200,
    };
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return {
        user: null,
        message: 'user not found',
        error: 'Not Found',
        statusCode: 404,
      };
    }

    return {
      user,
      message: 'ok',
      error: null,
      statusCode: 200,
    } as UserResponse;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(+id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
