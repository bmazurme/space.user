import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserById } from './interfaces/user-by-id.interface';
// import { UserResponse } from './interfaces/user-response';

@Controller('users')
export class UsersController implements OnModuleInit {
  // private usersService: UsersService;
  // @Inject('USER_PACKAGE') private readonly client: ClientGrpc;
  constructor(
    private readonly usersService: UsersService,
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    // this.usersService = this.client.getService<UsersService>('UsersService');
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @GrpcMethod('UsersService')
  async findOne(data: UserById) {
    return await this.usersService.findOne(+data.id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('me')
  async findMeById(@Req() req: { user: User }) {
    // console.log('=======', req);
    return await this.usersService.findOne(+req.user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
