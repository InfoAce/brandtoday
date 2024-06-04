import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiMiddleware, CsrfMiddleware, RedirectIfAuthMiddleware } from './middlewares';
import { JwtStrategy, LocalStrategy } from './guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController, AddressBookController, AuthController, CategoryController, CompanyController, DashboardOrderController, FavouriteController, HeaderController, HomeController, LoginController, OrderController, ProductsController, SignupController, SystemController, UserController, WebsiteController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigApp, ConfigDatabase, ConfigServices } from './config';
import { AmrodService, AuthService, MailService, PesapalService, RedisService } from './services';
import { AddressBookModule, CompanyModule, MailModule, UserModule, RoleModule, FavouriteModule, OrderModule, TransactionModule } from './modules';
import { AddressBookEntity, CompanyEntity, FavouriteEntity, OrderEntity, RoleEntity, TransactionEntity, UserEntity } from './entities';
import { ServeStaticModule } from '@nestjs/serve-static';
import { OrderSubscriber, UserSubscriber } from './subscribers';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { resolve } from 'path';
import { SessionSerialize } from './utils';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ ConfigApp, ConfigDatabase, ConfigServices],
      isGlobal: true
    }), 
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        ttl:      parseInt(configService.get<string>('app.CACHE_TTL')),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 1,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: true,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: true,
    }),
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
          AddressBookEntity,
          CompanyEntity,
          FavouriteEntity,
          OrderEntity,
          RoleEntity,
          TransactionEntity,
          UserEntity
        ],
        synchronize: false,
        subscribers: [
          OrderSubscriber,
          UserSubscriber
        ]
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
    AddressBookModule,
    CompanyModule,
    FavouriteModule,
    MailModule,
    OrderModule,
    RoleModule,
    TransactionModule,
    UserModule 
  ],
  controllers: [
    AccountController,
    AddressBookController,
    AuthController,
    CategoryController, 
    CompanyController, 
    DashboardOrderController,
    FavouriteController,
    HeaderController, 
    HomeController, 
    LoginController,
    ProductsController,
    OrderController,
    SignupController,
    SystemController,
    UserController,
    WebsiteController
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
    PesapalService,
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

