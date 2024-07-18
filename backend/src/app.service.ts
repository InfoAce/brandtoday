import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmrodService, MailService } from './services';
import { ConfigService } from '@nestjs/config';
import { sep } from 'path';
import { cloneDeep, getintersectionBy, get } from 'lodash';

@Injectable()
export class AppService {

  private config;

  private readonly logger    = new Logger(AppService.name);

  private jsonPlugin         = require('json-reader-writer');

  private readonly file_paths = {
    brands: `${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,
    stocks: `${process.cwd()}${sep}public${sep}amrod${sep}stock.json`,
    updated_stocks: `${process.cwd()}${sep}public${sep}amrod${sep}updated-stock.json`,
  };

  /**
   * The constructor for the AppService class.
   * 
   * The AppService class is responsible for scheduling jobs to synchronize
   * the Amrod categories, products, prices, brands and stocks with the local
   * storage once a day at 11 PM.
   * 
   * The constructor injects the CacheManager, AmrodService and ConfigService
   * instances and assigns the Amrod service configuration to the 'config'
   * property.
   * @param cacheManager The CacheManager instance.
   * @param amrodService The AmrodService instance.
   * @param configService The ConfigService instance.
   */
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private amrodService: AmrodService,
    private configService: ConfigService,
  ){
    /**
     * The Amrod service configuration.
     * @type {string}
     */
    this.config = this.configService.get<string>('services.amrod');     
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  /**
   * Updates the products and prices in the local storage with the latest ones from Amrod.
   * Also updates the local list of Amrod brands.
   * 
   * This method uses the AmrodService to log in to the Amrod API and retrieve the latest
   * product categories, prices, brands and products. It then writes the retrieved data
   * to the local storage in the form of JSON files.
   * 
   * @returns {Promise<void>} A promise that resolves once the data has been synchronized.
   */
  async updateProductsPricesBrands(){

    try {
      
      this.logger.log(`Synchronizing amrod categories, products, prices and brands.`);

      let { credentials } = this.config, fs = require('fs');
      
      // Log in to the Amrod API and retrieve the latest product categories, prices, brands and products
      await this.amrodService
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

            // Write the retrieved brands to the local storage
            await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,JSON.stringify(brands));

            // Write the retrieved categories to the local storage
            await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,JSON.stringify(categories));

            // Write the retrieved prices to the local storage
            await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}prices.json`,JSON.stringify(prices));

            // Write the retrieved products to the local storage
            await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}products.json`,JSON.stringify(products));

            this.logger.log(`Done synchronizing amrod categories, products, prices and brands.`);

          });

    } catch (error) {

      this.logger.error(error);

    }
  }



  @Cron(CronExpression.EVERY_10_MINUTES)
  /**
   * Asynchronously updates the stock data with the latest data from Amrod.
   * The function logs in to the Amrod API, retrieves the updated stocks and brands,
   * and writes the retrieved data to the local storage in JSON files.
   * 
   * @returns {Promise<void>} A promise that resolves once the data has been synchronized.
   */
  async updateStock(){

    try {

      // Log the start of the synchronization process
      this.logger.log(`Synchronizing amrod data sets.`);

      // Destructure the credentials from the config object
      let { credentials } = this.config;

      // Require the fs module
      let fs = require('fs');

      // Log in to the Amrod API
      await this.amrodService.login(credentials);

      // Fetch the updated stocks from the Amrod API
      let updated_stocks = await this.amrodService.getUpdatedStock();

      // Fetch the updated brands from the Amrod API
      let updated_brands = await this.amrodService.getUpdatedBrands();

      // Read the stored stocks from the local storage
      let stored_stocks = await this.jsonPlugin.readJSON(this.file_paths.stocks);

      // Read the stored brands from the local storage
      let stored_brands = await this.jsonPlugin.readJSON(this.file_paths.brands);

      // Update the stored stocks with the latest data from Amrod
      let stocks = stored_stocks.map( stock => updated_stocks.find( value => get(value,'fullCode') == stock.fullCode ) || stock );

      // Update the stored brands with the latest data from Amrod
      let brands = stored_brands.map( brand => updated_brands.find( value => value.code == brand.fullCode ) || brand );

      // Write the updated brands to the local storage
      await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,JSON.stringify(brands));

      // Write the updated stocks to the local storage
      await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}stock.json`,JSON.stringify(stocks));

      // Log the end of the synchronization process
      this.logger.log(`Done synchronizing amrod data sets.`);

    } catch (error) {

      // Log any errors that occur during the synchronization process
      this.logger.error(error);

    }

  }
}
