import { seeder, createClassSeeders  } from "nestjs-class-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AddressBookEntity, BrandEntity, CategoryEntity, ChildSubCategoryEntity, CompanyEntity, FavouriteEntity, OrderEntity, OrderItemEntity, OrderReviewEntity, PriceEntity, ProductCategoryEntity, ProductColourEntity, ProductEntity, ProductReviewEntity, ProductVariantEntity, QueueEntity, RoleEntity, StockEntity, StockKeepingEntity, SubCategoryEntity, TimelineEntity, TransactionEntity, UserEntity } from './entities';
import { ConfigApp, ConfigDatabase } from "./config";

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
                    CategoryEntity,
                    CompanyEntity,
                    ChildSubCategoryEntity,
                    FavouriteEntity,
                    OrderEntity,
                    OrderItemEntity,
                    OrderReviewEntity,
                    PriceEntity,
                    ProductEntity,
                    ProductCategoryEntity,
                    ProductColourEntity,
                    ProductReviewEntity,
                    ProductVariantEntity,
                    RoleEntity,
                    QueueEntity,
                    StockEntity,
                    StockKeepingEntity,
                    SubCategoryEntity,
                    TimelineEntity,
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
            QueueEntity
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
        ]
    )
)