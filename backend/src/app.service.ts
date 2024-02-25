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
  @Cron(CronExpression.EVERY_5_SECONDS)
  async amrodCredentials(){
    
    // try {

    //   // Fetch cached credentials
    //   let auth = await this.cacheManager.store.get('amrod_auth');
    //   // this.amrodService.login();

    //   // Check if the credentials are empty
    //   if( isEmpty(auth) ){
    //     this.amrodService.login();
    //   }
    
    // } catch (err) {

    //   console.log(err);
    
    // }

  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAmrodData(){

    // try {

    //   // Fetch amrod product categories
    //   let categories = await this.amrodService.getCategories();     

    //   // Fetch amrod products
    //   let products = await this.amrodService.getProducts();           

    //   await this.cacheManager.store.set('amrod_categories',categories);

    //   await this.cacheManager.store.set('amrod_products',products);
    
    // } catch (err) {

    //   console.log(err);
    
    // }

  }

}
