import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiMiddleware, RedirectIfAuthMiddleware } from './middlewares';
import { AppController } from './app.controller';
import { JwtStrategy, LocalStrategy } from './guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigDatabase } from './config';
import { AuthService } from './services';
import { CompanyModule, MailModule, UserModule, RoleModule } from './modules';
import { CompanyEntity, RoleEntity, UserEntity } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ ConfigDatabase ],
      isGlobal: true
    }), 
    CacheModule.register(),
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
        synchronize: true
      }),
      inject:[ConfigService]
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SESSION_KEY,
      signOptions: { expiresIn: process.env.JWT_SESSION_EXPIRES },
    }),
    MailModule,   
    CompanyModule,
    RoleModule,
    UserModule 
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,LocalStrategy],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware)
            .forRoutes("*");
    consumer.apply(RedirectIfAuthMiddleware)
            .exclude(
              'auth/logout'
            )
            .forRoutes(AuthController)            
  }
}

