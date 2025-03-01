import { seeder, createClassSeeders  } from "nestjs-class-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AddressBookEntity, BrandEntity, BrandingEntity, BrandingMethodEntity, CategoryEntity, ChildSubCategoryEntity, CompanyEntity, FavouriteEntity, OrderEntity, OrderItemEntity, OrderReviewEntity, OrderTimelineEntity, PriceEntity, ProductCategoryEntity, ProductColourEntity, ProductEntity, ProductReviewEntity, ProductVariantEntity, QueueEntity, QuoteEntity, RoleEntity, StockEntity, SubCategoryEntity, SubChildSubCategoryEntity, TransactionEntity, UserEntity } from './entities';
import { ConfigApp } from "./config";

seeder({
  debug: true,
  imports: [
    ConfigModule.forRoot({
        envFilePath: ['.env.development','.env.production', '.env'],
        load:[ ConfigApp ],
        isGlobal: true
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
                    RoleEntity,
                    QueueEntity,
                    QuoteEntity,
                    StockEntity,
                    SubCategoryEntity,
                    SubChildSubCategoryEntity,        
                    TransactionEntity,
                    UserEntity
                ],
                synchronize: true
            }
        },
        inject:[ConfigService]
    }),
  ],
}).run(
    createClassSeeders(
        [
            CompanyEntity, 
            RoleEntity, 
            RoleEntity, 
            RoleEntity, 
            RoleEntity, 
            UserEntity,
            QueueEntity,
            QueueEntity,
            QueueEntity,
            QueueEntity,
            QueueEntity,
            QueueEntity,
        ],
        [
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
        ]
    )
)