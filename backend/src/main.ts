import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import * as bodyParser from 'body-parser';
import * as hbs from 'hbs';
import * as cookieParser from "cookie-parser";
import * as session from 'express-session';
import * as passport from 'passport';
import * as csurf from 'tiny-csrf';
import { isEmpty } from 'lodash';
declare const module: any;

async function bootstrap() {
  const app  = await NestFactory.create<NestExpressApplication>(AppModule,{ cors: true,  snapshot: true, });
  const { APP_NAME, APP_PORT, COOKIE_KEY, CSRF_KEY, SESSION_KEY} = process.env;
  const hbsutils = require('hbs-utils')(hbs);

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./views'));

  app.setViewEngine('hbs');
  app.setBaseViewsDir('views')
  app.set('view options', { layout: 'global/layout' });

  app.use(cookieParser(COOKIE_KEY));
  app.use(session({ 
    name:              `${APP_NAME.split(' ').join('_')}_SESSION_ID`,
    secret:            SESSION_KEY,
    resave:            false,
    saveUninitialized: false,
    cookie : {
      maxAge:(1000 * 60 * 100)
    }
  }));
  // app.use(passport.intialize());
  app.use(passport.session());

  app.use(csurf(
    CSRF_KEY, // secret -- must be 32 bits or chars in length
    ["POST"], // the request methods we want CSRF protection for
    ["/api", /\/api\.*/i], // any URLs we want to exclude, either as strings or regexp
    []
    // [process.env.SITE_URL + "/service-worker.js"]  // any requests from here will not see the token and will not generate a new one
  ));

  hbs.registerPartials(resolve('./views/components'));
  hbs.registerPartials(resolve('./views/global'));
  hbs.registerPartials(resolve('./views/pages'));
  hbsutils.registerWatchedPartials(resolve('./views'));

  hbs.registerHelper("section", function(name, options){
    if (!this._sections) this._sections = {};
    this._sections[name] = options.fn(this); 
    return null;
  });

  hbs.registerHelper("isNotEmpty", function(array,options){
    return !isEmpty(array) ? options.fn(this) : null;
  });

  hbs.registerHelper("toBase64", function(string){
    return btoa(string);
  });

  hbs.registerHelper("findWithIndex", function(array,index,key){
    return array[index][key];
  });

  hbs.registerHelper("@csrfInput", function(csrf){
    return `<input type="hidden" value="${csrf}" name="_csrf" />`;
  });

  hbs.registerHelper("_csrf", function(){
    return `<input name="_csrf" value="Test" type="hidden" />`;
  });

  hbs.registerHelper("isEqual", function(){
    return `<input name="_csrf" value="Test" type="hidden" />`;
  });

  hbs.registerHelper("$array", function(length: number){
    return Array(length);
  });

  await app.listen(APP_PORT);

}

bootstrap();

