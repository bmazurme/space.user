import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { grpcClientOptions } from '../grpc-client.options';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
