import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';

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
      return {
        user: null,
        message: `user with ${email} exist`,
        error: 'Bad request',
        statusCode: 400,
      };
    }

    const user = await this.userRepository.save(createUserDto);

    return {
      user,
      message: 'ok',
      error: null,
      statusCode: 200,
    };
  }

  async findAll() {
    const users = await this.userRepository.find({});
    return {
      users,
      message: 'ok',
      error: null,
      statusCode: 200,
    };
  }

  buildResponse(user: User) {
    if (!user) {
      return {
        user: null,
        message: 'user not found',
        error: 'Not found',
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

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return this.buildResponse(user);
  }

  async findByEmail(email: string) {
    const user = email ? await this.userRepository.findOneBy({ email }) : null;
    return this.buildResponse(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(+id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
