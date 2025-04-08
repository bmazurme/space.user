import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { typeOrmModule } from './config/type-orm-module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    typeOrmModule,
    UsersModule,
    UserRolesModule,
    RolesModule,
  ],
})
export class AppModule {}
