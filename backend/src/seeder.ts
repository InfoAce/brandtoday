import { seeder, createClassSeeders  } from "nestjs-class-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CompanyEntity, RoleEntity, UserEntity } from "./entities";
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
            return {
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
            UserEntity
        ],
        [
            {count:1},
            {count:4},
            {count:1}
        ]
    )
);