import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { isEmpty } from 'lodash';
import { AmrodService, MailService } from './services';
import { OrderModel } from './models';
import { AmrodLoginEvent } from './events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  private config;

  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private amrodService: AmrodService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private mailService:  MailService,
    private orderModel:   OrderModel
  ){
    this.config = this.configService.get<string>('services.amrod');  
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateProductsPricesBrands(){

    try {

      // this.amrodService
      //     .login()
      //     .then( async() => {

      //       // Fetch amrod product categories
      //       let categories = await this.amrodService.getCategories();  

      //       // Fetch amrod prices
      //       let prices = await this.amrodService.getPrices();   

      //       // Fetch amrod brands
      //       let brands = await this.amrodService.getBrands();  
          
      //       // Fetch amrod products
      //       let products = await this.amrodService.getProducts();    

      //       await this.cacheManager.store.set('amrod_categories',categories);

      //       await this.cacheManager.store.set('amrod_products',products);

      //       await this.cacheManager.store.set('amrod_prices',prices);
            
      //       await this.cacheManager.store.set('amrod_brands',brands);
      
      //     });

    } catch (error) {

      this.logger.error(error);

    }
  }


  @Cron(CronExpression.EVERY_5_SECONDS)
  async updateStock(){

    try {
      this.logger.log(`Synchronizing amrod data sets.`);

      let { credentials }       = this.config;
      let amrodEvent            = new AmrodLoginEvent();

      amrodEvent.account_number = credentials.account_number;
      amrodEvent.password       = credentials.password;
      amrodEvent.username       = credentials.username;

      this.eventEmitter.emit('login',amrodEvent);
      // this.amrodService
      //     .login()
      //     .then( async () => {

      //       // Fetch amrod prices
      //       let stock = await this.amrodService.getStock();  

      //       // Fetch amrod brands
      //       let brands = await this.amrodService.getBrands();  
          
      //       await this.cacheManager.store.set('amrod_stock',stock);

      //       await this.cacheManager.store.set('amrod_brands',brands);

      //       this.logger.log(`Done synchronizing amrod data sets.`);

      //     });

    } catch (error) {

      this.logger.error(error);

    }
  }
}
