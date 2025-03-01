import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiMiddleware, CsrfMiddleware, RedirectIfAuthMiddleware } from './middlewares';
import { JwtStrategy, LocalStrategy } from './guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController, AddressBookController, AuthController, BrandingController, CategoryController, CompanyController, DashboardCategoryController, DashboardOrderController, FavouriteController, HeaderController, HomeController, HomeWebsiteController, OrderController, OverviewController, ProductsController, QueueController, QuoteController, SidebarController, SignupController, SystemController, UserController, WebsiteController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigApp, ConfigColors, ConfigDatabase, ConfigServices } from './config';
import { AmrodService, AuthService, MailService, PesapalService } from './services';
import { AddressBookModule, CompanyModule, MailModule, UserModule, RoleModule, FavouriteModule, OrderModule, TransactionModule, CategoryModule, BrandModule, StockModule, PriceModule, ProductModule, QueueModule, QuoteModule } from './modules';
import { AddressBookEntity, BrandEntity, BrandingEntity, BrandingMethodEntity, BrandingPriceEntity, CategoryEntity, ChildSubCategoryEntity, CompanyEntity, FavouriteEntity, OrderEntity, OrderItemEntity, OrderReviewEntity, OrderTimelineEntity, PriceEntity, ProductCategoryEntity, ProductColourEntity, ProductEntity, ProductReviewEntity, ProductVariantEntity, QueueEntity, QuoteEntity, RoleEntity, StockEntity, SubCategoryEntity, SubChildSubCategoryEntity, TransactionEntity, UserEntity } from './entities';
import { ServeStaticModule } from '@nestjs/serve-static';
import { OrderSubscriber, PriceSubscriber, ProductColourSubscriber, ProductSubscriber, StockSubscriber, UserSubscriber } from './subscribers';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { resolve } from 'path';
import { SessionSerialize } from './utils';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderCreatedListener } from './listeners';
import { CustomEmailvalidation } from './helpers/validators/user.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ ConfigApp, ConfigDatabase, ConfigServices, ConfigColors],
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
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
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
      useFactory: (configService: ConfigService) => {
        return {
          type:        "mysql",
          host:        configService.get<string>('app.DB_HOST'),
          port:        parseInt(configService.get<string>('app.DB_PORT')),
          database:    configService.get<string>('app.DB_DATABASE'),
          username:    configService.get<string>('app.DB_USERNAME'),
          password:    configService.get<string>('app.DB_PASSWORD'),
          entities:    [
            AddressBookEntity,
            BrandEntity,
            BrandingEntity,
            BrandingMethodEntity,
            BrandingPriceEntity,
            CategoryEntity,
            CompanyEntity,
            ChildSubCategoryEntity,
            FavouriteEntity,
            OrderEntity,
            OrderItemEntity,
            OrderReviewEntity,
            OrderTimelineEntity,
            PriceEntity,
            ProductEntity,
            ProductCategoryEntity,
            ProductColourEntity,
            ProductReviewEntity,
            ProductVariantEntity,
            QuoteEntity,
            QueueEntity,
            RoleEntity,
            StockEntity,
            SubCategoryEntity,
            SubChildSubCategoryEntity,
            TransactionEntity,
            UserEntity
          ],
          synchronize: true,
          subscribers: [
            OrderSubscriber,
            PriceSubscriber,
            ProductColourSubscriber,
            StockSubscriber,
            UserSubscriber
          ]
        }
      },
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
    BrandModule,
    CategoryModule,
    CompanyModule,
    FavouriteModule,
    OrderModule,
    PriceModule,
    ProductModule,
    QuoteModule,
    QueueModule,
    RoleModule,
    StockModule,
    TransactionModule,
    UserModule 
  ],
  controllers: [
    AccountController,
    AddressBookController,
    AuthController,
    BrandingController,
    CategoryController, 
    CompanyController, 
    DashboardCategoryController,
    DashboardOrderController,
    FavouriteController,
    HeaderController, 
    HomeController, 
    HomeWebsiteController,
    ProductsController,
    OrderController,
    OverviewController,
    QuoteController,
    QueueController,
    SidebarController,
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
    CustomEmailvalidation,
    JwtStrategy,
    LocalStrategy,
    PesapalService,
    OrderCreatedListener,
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

