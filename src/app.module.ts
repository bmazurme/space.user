import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './users/user.module';
import { typeOrmModule } from './config/type-orm-module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    typeOrmModule,
    UserModule,
  ],
})
export class AppModule {}
