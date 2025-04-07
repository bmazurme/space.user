import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { grpcClientOptions } from '../grpc-client.options';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
