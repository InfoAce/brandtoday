import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiMiddleware, CsrfMiddleware, RedirectIfAuthMiddleware } from './middlewares';
import { JwtStrategy, LocalStrategy } from './guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController, AuthController, CategoryController, CompanyController, FavouriteController, HeaderController, HomeController, LoginController, ProductsController, SignupController, SystemController, UserController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigApp, ConfigDatabase, ConfigServices } from './config';
import { AmrodService, AuthService, MailService, RedisService } from './services';
import { CompanyModule, MailModule, UserModule, RoleModule, FavouriteModule } from './modules';
import { CompanyEntity, FavouriteEntity, RoleEntity, UserEntity } from './entities';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserSubscriber } from './subscribers';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { resolve } from 'path';
import { SessionSerialize } from './utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ ConfigApp, ConfigDatabase, ConfigServices],
      isGlobal: true
    }), 
    CacheModule.registerAsync(RedisService),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ScheduleModule.forRoot(),   
    ServeStaticModule.forRoot({
      rootPath: resolve('./public'),
      exclude: ['/api/(.*)']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type:        "mysql",
        host:        configService.get<string>('DB_HOST'),
        port:        parseInt(configService.get<string>('DB_PORT')),
        database:    configService.get<string>('DB_DATABASE'),
        username:    configService.get<string>('DB_USERNAME'),
        password:    configService.get<string>('DB_PASSWORD'),
        entities:    [
          CompanyEntity,
          FavouriteEntity,
          RoleEntity,
          UserEntity
        ],
        synchronize: true,
        subscribers: [UserSubscriber]
      }),
      inject:[ConfigService]
    }),
    PassportModule.register({
      session: true
    }),
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      useFactory: async( configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SESSION_KEY'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES') 
        },
      }),
      inject: [ConfigService]
    }),
    MailModule,   
    CompanyModule,
    FavouriteModule,
    MailModule,
    RoleModule,
    UserModule 
  ],
  controllers: [
    AccountController,
    AuthController,
    CategoryController, 
    CompanyController, 
    FavouriteController,
    HeaderController, 
    HomeController, 
    LoginController,
    ProductsController,
    SignupController,
    SystemController,
    UserController
  ],
  providers: [
    AppService,
    AuthService,
    AmrodService,
    {
      provide: 'CacheService',
      useClass: CacheInterceptor,
    },
    JwtStrategy,
    LocalStrategy,
    SessionSerialize
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware)
            .forRoutes("api/*");
    consumer.apply(CsrfMiddleware)
            .exclude("api/*")
            .forRoutes("*");
    consumer.apply(RedirectIfAuthMiddleware)
            .exclude('auth/logout')
            .forRoutes(AuthController)            
  }
}

