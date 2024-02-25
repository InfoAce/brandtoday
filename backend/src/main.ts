import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import * as bodyParser from 'body-parser';
import * as hbs from 'hbs';
import { nestCsrf, CsrfFilter } from "ncsrf";
import cookieParser from "cookie-parser";
declare const module: any;

async function bootstrap() {
  const app          = await NestFactory.create<NestExpressApplication>(AppModule,{ cors: true,  snapshot: true, });
  const { APP_PORT, APP_NAME, SESSION_KEY} = process.env;

  app.useGlobalPipes(new ValidationPipe());
  // app.setGlobalPrefix('api');
  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./views'));

  app.setViewEngine('hbs');
  app.setBaseViewsDir('views')
  app.set('view options', { layout: 'global/layout' });
  
  hbs.registerPartials(resolve('./views/components'));
  hbs.registerPartials(resolve('./views/global'));
  hbs.registerPartials(resolve('./views/pages'));

  hbs.registerHelper("section", function(name, options){
    if (!this._sections) this._sections = {};
    this._sections[name] = options.fn(this); 
    return null;
  });

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  app.use(nestCsrf());

  await app.listen(APP_PORT);

}

bootstrap();

