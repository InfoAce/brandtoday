import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app          = await NestFactory.create<NestExpressApplication>(AppModule,{ cors: true,  snapshot: true, });
  const { APP_PORT } = process.env;
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(APP_PORT);
}
bootstrap();

