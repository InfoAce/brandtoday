import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmrodService, MailService } from './services';
import { ConfigService } from '@nestjs/config';
import { sep } from 'path';
import { cloneDeep, chunk, isEmpty, isNull, take } from 'lodash';
import { BrandModel, CategoryModel, ChildSubCategoryModel, CompanyModel, PriceModel, ProductCategoryModel, ProductColourModel, ProductModel, ProductVariantModel, QueueModel, RoleModel, StockKeepingModel, StockModel, SubCategoryModel, UserModel } from 'src/models';
import { v4 as uuidv4 } from 'uuid';
import { queue } from 'rxjs';

@Injectable()
export class AppService {

  private readonly logger    = new Logger(AppService.name);

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
    private amrodService:  AmrodService,
    private configService: ConfigService,
    private queueModel:    QueueModel,
    private brandModel:           BrandModel,
    private categoryModel:        CategoryModel,
    private childSubCategory:     ChildSubCategoryModel,
    private priceModel:           PriceModel,
    private productModel:         ProductModel,
    private productColourModel:   ProductColourModel,
    private productCategoryModel: ProductCategoryModel,
    private productVariantModel:  ProductVariantModel,
    private stockModel:           StockModel,
    private stockKeepingModel:    StockKeepingModel,
    private subCategoryModel:     SubCategoryModel,
  ){ }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkQueuesAndSync(){
      try {
        
        let queues = await this.queueModel.find({ where: { state: 1, status:'waiting' } });

        if( !isEmpty(queues) ){
          
          this.logger.log(`Synchronizing queues ${queues.length}`);

          // Get amrod credentials from the configuration service
          let { credentials } = this.configService.get<any>('services.amrod');

          // Login to amrod
          await this.amrodService.login(credentials);

          // Sync queues
          await Promise.all(
            queues.map( async (queue) => {
              // Update queue status
              await this.queueModel.updateOne({ id: queue.id},{ status: 'pending' });
              switch(queue.type){
                case 'brands':
                  this.synchronizeBrands(queue);
                break;
                case 'categories':
                  this.synchronizeCategories(queue);
                break;
                case 'products':
                  this.synchronizeProducts(queue);
                break;
                case 'prices':
                  this.synchronizePrices(queue);
                break;
                case 'stocks':
                  this.synchronizeStocks(queue);
                break;
              }
            })
          );
        }

      } catch(error) {

      }
  }

  async synchronizeBrands(queue) {
    
    // Logging
    this.logger.log(`Synchronizing brands`);

    // Fetch amrod brands
    let brands = await this.amrodService.getBrands(); 

    await Promise.all(
      chunk(brands,500).map( async (brands) => {
          return new Promise( async (resolve,reject) => {
              // setTimeout( async (brands) => {
                  await this.brandModel.insert(
                      brands.map( 
                          ({ code, image, name}) => ({ code, name, image }) 
                      )
                  );
                  resolve(true);
              // }, 2000);
          })
      })
    )

    // Logging
    this.logger.log(`Done Synchronizing brands`);

    // Update queue status
    await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
  }

  async synchronizeCategories(queue) {
     // Logging
     this.logger.log(`Synchronizing categories`);

     // Fetch amrod product categories
     let categories           = (await this.amrodService.getCategories()).map( category => ({ ...category, id: uuidv4() }));  
     let sub_categories       = categories.map( category => category.children.map( sub_category => ({ ...sub_category, id: uuidv4(), category_id: category.id, children: sub_category.children }) ) ).flat();
     let child_sub_categories = sub_categories.map( sub_category => sub_category.children.map( child_sub_category => ({ ...child_sub_category, id: uuidv4(), sub_category_id: sub_category.id }) ) ).flat();
     
     await Promise.all(
         chunk(categories,500).map( async (categories) => {
             return new Promise( async (resolve,reject) => {
                //  setTimeout( async (categories) => {
                    await this.categoryModel.insert(
                        categories.map( 
                            ({categoryName: name, categoryCode: code, categoryPath: path, id }) => ({ id, code, name, path}) 
                        )
                    )
                    resolve(true);
                //  }, 2000);
             })
         })
     )


     await Promise.all(
         chunk(sub_categories,500).map( async (sub_categories) => {
             return new Promise( async (resolve,reject) => {
                //  setTimeout( async (sub_categories) => {
                    await this.subCategoryModel.insert(
                            sub_categories.map( ({categoryName: name, categoryCode: code, categoryPath: path, id, category_id }) => ({ id, category_id, code, name, path}) 
                        )
                    )
                    resolve(true);
                //  }, 2000);
             })
         })
     )


     await Promise.all(
         chunk(child_sub_categories,500).map( async (child_sub_categories) => {
             return new Promise( async (resolve,reject) => {
                //  setTimeout( async (child_sub_categories) => {
                    await this.childSubCategory.insert(
                        child_sub_categories.map( 
                            ({categoryName: name, categoryCode: code, categoryPath: path, id, sub_category_id }) => ({ id, sub_category_id, code, name, path}) 
                        )
                    )
                    resolve(true);
                //  }, 2000);
             })
         })
     )

     // Logging
     this.logger.log(`Done Synchronizing categories`);

     // Update queue status
     await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
  }

  async synchronizeProducts(queue) {
    // Logging
    this.logger.log(`Synchronizing products`);

    // Fetch amrod products
    let products             = (await this.amrodService.getProducts()).map( product => ({ ...product, id: uuidv4() }));    
    let categories           = await this.categoryModel.find();  
    let sub_categories       = await this.subCategoryModel.find();
    let child_sub_categories = await this.childSubCategory.find();

    let product_categories  = products.map( 
        product => product.categories.map( 
            category => {
                let path = category.path.split('/');
                if( path.length > 2) {
                    let fetched_sub_category       = sub_categories.find( fetched_sub_category => fetched_sub_category.path == take(path,2).join('/') );
                    let fetched_child_sub_category = child_sub_categories.find( fetched_child_sub_category => fetched_child_sub_category.path == take(path,3).join('/') );
                    return { 
                        id: uuidv4(), 
                        category_id:           fetched_sub_category.category_id, 
                        sub_category_id:       fetched_child_sub_category.sub_category_id, 
                        child_sub_category_id: fetched_child_sub_category.id, 
                        product_id:   product.id 
                    }
                }
                if( path.length == 2) {
                    let fetched_sub_category = sub_categories.find( fetched_sub_category => fetched_sub_category.path == take(path,2).join('/') );
                    return {  
                        id: uuidv4(), 
                        category_id: fetched_sub_category.category_id, 
                        sub_category_id: fetched_sub_category.id, 
                        product_id:   product.id 
                    }
                }
                if( path.length == 1) {
                    let fetched_category = categories.find( fetched_category => fetched_category.path == take(path,1).join('/') );
                    return { id: uuidv4(), category_id: fetched_category.id, product_id: product.id }
                }
            }
        ) 
    ).flat();

    let colour_images = products.filter( product => !isNull(product.colourImages) ).map( product => product.colourImages.map( images => ({...images, product_id: product.id })) ).flat().map( colour => ({ ...colour, id: uuidv4() }) );

    let variants      = products.map( product => product.variants.map( variant => ({ ...variant, id: uuidv4(), product_id: product.id }) ) ).flat();

    await Promise.all(
        chunk(products,1000).map( async (products) => {
            return new Promise( async (resolve,reject) => {
                // setTimeout( async (products) => {
                    await this.productModel.insert(
                        products.map( 
                            ({ id, fullCode: full_code, simpleCode: simple_code, price: amount, gender, images, variants, brandingTemplates: branding_templates, fullBrandingGuide: full_branding_guide, logo24BrandingGuide: logo_branding_guide, description, productName: name, companionCodes: companion_codes }) => 
                                ({ id, full_code, simple_code, amount, gender, branding_templates, variants, images, companion_codes, description, full_branding_guide, logo_branding_guide, name }) 
                        )
                    );
                    resolve(true);
                // }, 2000);
            })
        })
    )

    await Promise.all(
        chunk(
            colour_images,
            500
        ).map( async (colour) => {
            return new Promise( async (resolve,reject) => {
                // setTimeout( async (products) => {
                    await this.productColourModel.insert(
                        colour.map( 
                            ({ id, name, images, code, product_id }) => ({ id, name, images, code, product_id }) 
                        )
                    );
                    resolve(true);
                // }, 2000);
            })
        })
    )

    await Promise.all(
        chunk(variants,500).map( async (variants) => {
            return new Promise( async (resolve,reject) => {
                // setTimeout( async () => {
                    await this.productVariantModel.insert( 
                        variants.map( (variant, index) => { 
                                return { 
                                    id:                      variant.id, 
                                    product_id:              variant.product_id, 
                                    simple_code:             variant.simpleCode, 
                                    full_code:               variant.fullCode, 
                                    code_colour:             variant.codeColour, 
                                    code_colour_name:        variant.codeColourName, 
                                    code_size:               variant.codeSize, 
                                    code_size_name:          variant.codeSizeName, 
                                    categorized_attribute:   variant.categorisedAttribute, 
                                    packaging_and_dimension: variant.packagingAndDimension, 
                                    product_dimension:       variant.productDimension, 
                                    is_logo_24:              variant.isLogo24, 
                                    components:              variant.components 
                                }
                            }
                        ) 
                    )
                    resolve(true);
                // }, 2000)
            }) 
        })
    );


    await Promise.all(
        chunk(product_categories,2000).map( async (prod_categories) => {
            return new Promise( async (resolve,reject) => {
                // setTimeout( async (prod_categories) => {
                    await this.productCategoryModel.insert( prod_categories );
                    resolve(true);
                // }, 5000)
            }) 
        })
    )

    // Logging
    this.logger.log(`Done Synchronizing products`);

    // Update queue status
    await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
  }

  async synchronizePrices(queue) {
    // Logging
    this.logger.log(`Synchronizing prices`);

    // Fetch amrod prices
    let prices = await this.amrodService.getPrices();   

    await Promise.all(
        chunk(prices,500).map( async (prices) => {
            return new Promise( async (resolve,reject) => {
                // setTimeout( async () => {
                    await this.priceModel.insert( 
                        prices.map( 
                            ({ fullCode: full_code, simplecode: simple_code, price: amount }) => 
                                ({ full_code, simple_code, amount }) )
                    );
                    resolve(true);
                // }, 2000)
            }) 
        })
    );

    // Logging
    this.logger.log(`Done Synchronizing prices`);

    // Update queue status
    await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
  }

  async synchronizeStocks(queue) {
    // Logging
    this.logger.log(`Synchronizing stocks`);

    // Fetch amrod stock
    let stocks   = (await this.amrodService.getStock()).map( stock => ({ ...stock, id: uuidv4() }));
    let products = await this.productModel.find();    
    let variants = await this.productVariantModel.find();

    await Promise.all(
        chunk(stocks,500).map( async (stocks) => {
            return new Promise( async (resolve,reject) => {
                await this.stockModel.insert( 
                    stocks.map( 
                        ({simpleCode: simple_code, fullCode: full_code, stockType: type, stock: quantity, reservedStock: reserved_quantity, incomingStock: incoming_quantity, colourCode: colour_code, id}) => {
                            return { id, simple_code, full_code, type, quantity, reserved_quantity, incoming_quantity, colour_code }
                        }
                    )
                )
                resolve(true);
            })
        })
    );

    await Promise.all(
        chunk(
            stocks.map( 
                ({fullCode: full_code, id}) => {
                    let variant = variants.find( variant => variant.full_code == full_code );
                    let product = products.find( product => product.full_code == full_code );
                    if( !isEmpty(variant)){
                        return  { stock_id: id, variant_id: variant.id, id: uuidv4() };
                    } else {
                        if( !isEmpty(product) ){
                            return { stock_id: id, product_id: product.id, id: uuidv4()}
                        }
                        return {}
                    }
                }
            ).filter( value => !isEmpty(value) ),
            1000
        ).map( async (stock_keeping) => {
            return new Promise( async (resolve,reject) => {
                // setTimeout( async () => {
                    await this.stockKeepingModel.insert(stock_keeping);
                    resolve(true);

                // }, 2000)
            }) 
        })
    );

    // Logging
    this.logger.log(`Done Synchronizing stocks`);

    // Update queue status
    await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
  }
    
  // @Cron(CronExpression.EVERY_DAY_AT_2AM)
  // /**
  //  * Updates the products and prices in the local storage with the latest ones from Amrod.
  //  * Also updates the local list of Amrod brands.
  //  * 
  //  * This method uses the AmrodService to log in to the Amrod API and retrieve the latest
  //  * product categories, prices, brands and products. It then writes the retrieved data
  //  * to the local storage in the form of JSON files.
  //  * 
  //  * @returns {Promise<void>} A promise that resolves once the data has been synchronized.
  //  */
  // async updateProductsPricesBrands(){

  //   try {
      
  //     this.logger.log(`Synchronizing amrod categories, products, prices and brands.`);

  //     let { credentials } = this.config, fs = require('fs');
      
  //     // Log in to the Amrod API and retrieve the latest product categories, prices, brands and products
  //     await this.amrodService
  //         .login(credentials)
  //         .then( async() => {

  //           // Fetch amrod product categories
  //           let categories = await this.amrodService.getCategories();  

  //           // Fetch amrod prices
  //           let prices = await this.amrodService.getPrices();   

  //           // Fetch amrod brands
  //           let brands = await this.amrodService.getBrands();  
          
  //           // Fetch amrod products
  //           let products = await this.amrodService.getProducts();   

  //           // Write the retrieved brands to the local storage
  //           await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,JSON.stringify(brands));

  //           // Write the retrieved categories to the local storage
  //           await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,JSON.stringify(categories));

  //           // Write the retrieved prices to the local storage
  //           await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}prices.json`,JSON.stringify(prices));

  //           // Write the retrieved products to the local storage
  //           await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}products.json`,JSON.stringify(products));

  //           this.logger.log(`Done synchronizing amrod categories, products, prices and brands.`);

  //         });

  //   } catch (error) {

  //     this.logger.error(error);

  //   }
  // }



  // @Cron(CronExpression.EVERY_10_MINUTES)
  // /**
  //  * Asynchronously updates the stock data with the latest data from Amrod.
  //  * The function logs in to the Amrod API, retrieves the updated stocks and brands,
  //  * and writes the retrieved data to the local storage in JSON files.
  //  * 
  //  * @returns {Promise<void>} A promise that resolves once the data has been synchronized.
  //  */
  // async updateStock(){

  //   try {

  //     // Log the start of the synchronization process
  //     this.logger.log(`Synchronizing amrod data sets.`);

  //     // Destructure the credentials from the config object
  //     let { credentials } = this.config;

  //     // Require the fs module
  //     let fs = require('fs');

  //     // Log in to the Amrod API
  //     await this.amrodService.login(credentials);

  //     // Fetch the updated stocks from the Amrod API
  //     let updated_stocks = await this.amrodService.getUpdatedStock();

  //     // Fetch the updated brands from the Amrod API
  //     let updated_brands = await this.amrodService.getUpdatedBrands();

  //     // Read the stored stocks from the local storage
  //     let stored_stocks = await this.jsonPlugin.readJSON(this.file_paths.stocks);

  //     // Read the stored brands from the local storage
  //     let stored_brands = await this.jsonPlugin.readJSON(this.file_paths.brands);

  //     // Update the stored stocks with the latest data from Amrod
  //     let stocks = stored_stocks.map( stock => updated_stocks.find( value => get(value,'fullCode') == stock.fullCode ) || stock );

  //     // Update the stored brands with the latest data from Amrod
  //     let brands = stored_brands.map( brand => updated_brands.find( value => value.code == brand.fullCode ) || brand );

  //     // Write the updated brands to the local storage
  //     await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,JSON.stringify(brands));

  //     // Write the updated stocks to the local storage
  //     await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}stock.json`,JSON.stringify(stocks));

  //     // Log the end of the synchronization process
  //     this.logger.log(`Done synchronizing amrod data sets.`);

  //   } catch (error) {

  //     // Log any errors that occur during the synchronization process
  //     this.logger.error(error);

  //   }

  // }
}
