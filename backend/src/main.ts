import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //obtener ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;
  const corsOrigin = configService.get<string>('cors.origin');

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

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
