import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiMiddleware, RedirectIfAuthMiddleware } from './middlewares';
import { JwtStrategy, LocalStrategy } from './guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController, CompanyController, SystemController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigDatabase, ConfigServices } from './config';
import { AuthService } from './services';
import { CompanyModule, MailModule, UserModule, RoleModule } from './modules';
import { CompanyEntity, RoleEntity, UserEntity } from './entities';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { UserSubscriber } from './subscribers';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ ConfigDatabase, ConfigServices],
      isGlobal: true
    }), 
    CacheModule.register(),
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
  controllers: [AuthController, CompanyController, SystemController],
  providers: [AuthService,JwtStrategy,LocalStrategy],
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

