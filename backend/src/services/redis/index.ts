import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";
import { createClient } from 'redis';


export const RedisService: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {

    const logger = new Logger(RedisService.constructor.name);

    try{
      const store = await redisStore({
        password: configService.get<string>('app.REDIS_PASSWORD'),
        socket: {
          host:       configService.get<string>('app.REDIS_HOST'),
          port:       parseInt(configService.get<string>('app.REDIS_PORT')),
          // passphrase: configService.get<string>('app.REDIS_PASSWORD'),
        },
      });

      return { store };

    } catch(error) {

      logger.error(error);

    }

  },
  inject: [ConfigService],
};