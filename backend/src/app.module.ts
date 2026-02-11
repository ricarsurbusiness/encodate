import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import envConfig from './config/env.config';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './businesses/business.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [envConfig],
      cache: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    ServicesModule,
    BookingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
