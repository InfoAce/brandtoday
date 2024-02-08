import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiMiddleware, RedirectIfAuthMiddleware } from './middlewares';
import { JwtStrategy, LocalStrategy } from './guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController, CompanyController, LandingController, SystemController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigDatabase, ConfigServices } from './config';
import { AmrodService, AuthService } from './services';
import { CompanyModule, MailModule, UserModule, RoleModule } from './modules';
import { CompanyEntity, RoleEntity, UserEntity } from './entities';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { UserSubscriber } from './subscribers';
import { HttpModule } from '@nestjs/axios';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { RedisOptions } from './services/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ ConfigDatabase, ConfigServices],
      isGlobal: true
    }), 
    CacheModule.registerAsync(RedisOptions),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
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
          RoleEntity,
          UserEntity
        ],
        synchronize: true,
        subscribers: [UserSubscriber]
      }),
      inject:[ConfigService]
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      useFactory: async( configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SESSION_KEY'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_SESSION_EXPIRES') 
        },
      }),
      inject: [ConfigService]
    }),
    MailModule,   
    CompanyModule,
    RoleModule,
    UserModule 
  ],
  controllers: [AuthController, CompanyController, LandingController, SystemController],
  providers: [
    AuthService,
    AmrodService,
    {
      provide: 'CacheService',
      useClass: CacheInterceptor,
    },
    JwtStrategy,
    LocalStrategy
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware)
            .forRoutes("*");
    consumer.apply(RedirectIfAuthMiddleware)
            .exclude('auth/logout')
            .forRoutes(AuthController)            
  }
}

