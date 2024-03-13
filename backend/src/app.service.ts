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

  // Check for amrod api credntials
  @Cron(CronExpression.EVERY_HOUR)
  async amrodCredentials(){
    
    try {
      this.amrodService.login();
    } catch (err) {
      console.log(err);
    }

  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateAmrodData(){

    try {

      // Fetch amrod product categories
      let categories = await this.amrodService.getCategories();     

      // Fetch amrod products
      let products = await this.amrodService.getProducts();    
      
      // Fetch amrod prices
      let prices = await this.amrodService.getPrices();   
      
      // Fetch amrod prices
      let stock = await this.amrodService.getStock();   

      await this.cacheManager.store.set('amrod_categories',categories);

      await this.cacheManager.store.set('amrod_products',products);

      await this.cacheManager.store.set('amrod_prices',prices);
    
      await this.cacheManager.store.set('amrod_stock',stock);

    } catch (err) {

      console.log(err);
    
    }

  }

}
