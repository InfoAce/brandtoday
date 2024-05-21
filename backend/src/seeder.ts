import { seeder, createClassSeeders  } from "nestjs-class-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AddressBookEntity, CompanyEntity, FavouriteEntity, OrderEntity, RoleEntity, TransactionEntity, UserEntity } from "./entities";
import { ConfigDatabase } from "./config";

seeder({
  debug: true,
  imports: [
    ConfigModule.forRoot({
        envFilePath: ['.env.development','.env.production', '.env'],
        load:[ ConfigDatabase ],
        isGlobal: true
    }), 
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            console.log(configService.get<any>('app'))
            return {
                type:        "mysql",
                host:        configService.get<string>('app.DB_HOST'),
                port:        parseInt(configService.get<string>('app.DB_PORT')),
                database:    configService.get<string>('app.DB_DATABASE'),
                username:    configService.get<string>('app.DB_USERNAME'),
                password:    configService.get<string>('app.DB_PASSWORD'),
                entities:    [
                    AddressBookEntity,
                    CompanyEntity,
                    FavouriteEntity,
                    OrderEntity,
                    RoleEntity,
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
            UserEntity
        ],
        [
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1},
            {count:1}
        ]
    )
).then( () => {
    console.log('Seeding completed successfully.');
});