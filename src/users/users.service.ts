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

  buildResponse(user: User) {
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

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return this.buildResponse(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return this.buildResponse(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(+id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
