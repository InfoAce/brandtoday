import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app  = await NestFactory.create<NestExpressApplication>(AppModule,{ cors: true,  snapshot: true, });
  const { APP_PORT } = process.env;

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  app.useStaticAssets(resolve('./public'));

  await app.listen(APP_PORT);

}

bootstrap();

