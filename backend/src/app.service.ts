import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { isEmpty } from 'lodash';
import { AmrodService } from './services';

@Injectable()
export class AppService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private amrodService: AmrodService,
  ){}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateProductsPricesBrands(){

    try {

      this.amrodService
          .login()
          .then( async() => {

            // Fetch amrod product categories
            let categories = await this.amrodService.getCategories();  

            // Fetch amrod prices
            let prices = await this.amrodService.getPrices();   

            // Fetch amrod brands
            let brands = await this.amrodService.getBrands();  
          
            // Fetch amrod products
            let products = await this.amrodService.getProducts();    

            await this.cacheManager.store.set('amrod_categories',categories);

            await this.cacheManager.store.set('amrod_products',products);

            await this.cacheManager.store.set('amrod_prices',prices);
            
            await this.cacheManager.store.set('amrod_brands',brands);
      
          });

    } catch (err) {

    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateStock(){

    try {

      this.amrodService
          .login()
          .then( async () => {

            // // Fetch amrod prices
            // let stock = await this.amrodService.getStock();  

            // // Fetch amrod brands
            // let brands = await this.amrodService.getBrands();  
          
            // await this.cacheManager.store.set('amrod_stock',stock);

            // await this.cacheManager.store.set('amrod_brands',brands);

          });

    } catch (err) {

    }
  }
}
