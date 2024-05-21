import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmrodService, MailService } from './services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  private config;

  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private amrodService: AmrodService,
    private configService: ConfigService,
  ){
    this.config = this.configService.get<string>('services.amrod');  
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateProductsPricesBrands(){

    try {
      this.logger.log(`Synchronizing amrod categories, products, prices and brands.`);

      let { credentials } = this.config;

      this.amrodService
          .login(credentials)
          .then( async() => {

            // Fetch amrod product categories
            let categories = await this.amrodService.getCategories();  

            // Fetch amrod prices
            let prices = await this.amrodService.getPrices();   

            // Fetch amrod brands
            let brands = await this.amrodService.getBrands();  
          
            // Fetch amrod products
            let products = await this.amrodService.getProducts();    

            await this.cacheManager.set('amrod_categories', categories, 0);
            
            await this.cacheManager.set('amrod_products', products, 0);

            await this.cacheManager.set('amrod_prices', prices, 0);
            
            await this.cacheManager.set('amrod_brands', brands, 0);

            this.logger.log(`Done synchronizing amrod categories, products, prices and brands.`);

          });

    } catch (error) {

      this.logger.error(error);

    }
  }


  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateStock(){

    try {

      this.logger.log(`Synchronizing amrod data sets.`);

      let { credentials } = this.config;

      this.amrodService
          .login(credentials)
          .then( async () => {

            // Fetch amrod prices
            let stock = await this.amrodService.getStock();  

            // Fetch amrod brands
            let brands = await this.amrodService.getBrands();  
          
            await this.cacheManager.set('amrod_stock',stock, 0);

            await this.cacheManager.set('amrod_brands',brands, 0);

            this.logger.log(`Done synchronizing amrod data sets.`);

          });

    } catch (error) {

      this.logger.error(error);
 
    }
  }
}
