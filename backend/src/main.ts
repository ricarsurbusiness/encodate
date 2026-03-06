/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //obtener ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;
  const corsOrigin = configService.get<string>('cors.origin')?? 'http://localhost:3000';

  //configurar cors
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilita @Type() transformations
      whitelist: true, // Remueve propiedades no definidas en DTO
    }),
  );

  // 📚 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Booking System API')
    .setDescription(
      'API REST para sistema de reservas de negocios con servicios. ' +
        'Incluye autenticación con JWT + Refresh Tokens, gestión de negocios, servicios y reservas.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y registro de usuarios')
    .addTag('users', 'Gestión de usuarios y perfiles')
    .addTag('businesses', 'Gestión de negocios')
    .addTag('services', 'Gestión de servicios de negocios')
    .addTag('bookings', 'Gestión de reservas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el JWT token obtenido del login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
