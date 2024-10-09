import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmrodService, MailService } from './services';
import { ConfigService } from '@nestjs/config';
import { sep } from 'path';
import { cloneDeep, chunk, isEmpty, isNull, get, take, intersectionBy } from 'lodash';
import { BrandModel, CategoryModel, ChildSubCategoryModel, CompanyModel, PriceModel, ProductCategoryModel, ProductColourModel, ProductModel, ProductVariantModel, QueueModel, RoleModel, StockKeepingModel, StockModel, SubCategoryModel, UserModel } from 'src/models';
import { v4 as uuidv4 } from 'uuid';


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
    private companyModel:         CompanyModel,
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
                case 'product_variants':
                    this.synchronizeProductVariants(queue);
                  break;
                case 'prices':
                  this.synchronizePrices(queue);
                break;
                case 'stocks':
                  this.synchronizeStocks(queue);
                break;
                case 'stock_keeping':
                    this.synchronizeStockKeeping(queue);
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
    try{
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
    } catch (error) {
        // Logging
        this.logger.log(`Failed to synchronize stock keeping`);
        
        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'failed', state: false, message: JSON.stringify(error) });        
    }
  }

  
  async synchronizeProductVariants(queue) {
    try{
        // Logging
        this.logger.log(`Synchronizing product variants`);

        // Fetch amrod products
        let products = (await this.amrodService.getProducts()).map( async(product) => ({ ...product, id: (await this.productModel.findOne({ where: { full_code: product.fullCode } })).id })); 
        let variants = (await Promise.all(
            products.map( async(product) => (await product).variants.map( async(variant) => ({ ...variant, product_id: (await product).id, id: uuidv4() }) ) )
        )).flat();

        variants = await Promise.all(
            chunk(variants,1000).map( async (variants) => {
                return await Promise.all(
                        variants.map( async (variant, index) => { 
                            variant = await variant;
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
            })
        );

        await Promise.all(
            variants.map( async (variants) => {
                return new Promise( async (resolve,reject) => {
                    await this.productVariantModel.insert(variants)
                    resolve(true);
                }) 
            })
        );

        // Logging
        this.logger.log(`Done Synchronizing product variants`);

        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
    } catch (error) {
        console.log(error);
        // Logging
        this.logger.log(`Failed to synchronize product variants`);
        
        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'failed', state: false, message: JSON.stringify(error) });        
    }
  }

  async synchronizePrices(queue) {
    // Logging
    this.logger.log(`Synchronizing prices`);

    // Fetch amrod prices
    let prices  = await this.amrodService.getPrices();  
    let company = await this.companyModel.first(); 


    await Promise.all(
        chunk(prices,5).map( async (prices) => {
            return new Promise( async (resolve,reject) => {
                try {
                    await this.priceModel.insert( 
                        prices.map( 
                            ({ fullCode: full_code, simplecode: simple_code, price: amount }) => 
                            ({ full_code, simple_code, amount, company_id: company.id })
                        )
                    );
                    setTimeout( () => resolve(true), 2000);
                } catch (error) {
                    console.log(error);
                    console.log(prices)
                }
            }) 
        })
    );

    // Logging
    this.logger.log(`Done Synchronizing prices`);

    // Update queue status
    await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
  }

  async synchronizeStocks(queue) {
    try{
        // Logging
        this.logger.log(`Synchronizing stocks`);

        // Fetch amrod stock
        let stocks   = (await this.amrodService.getStock()).map( stock => ({ ...stock, id: uuidv4() }));

        // Get product variants
        let variants = await this.productVariantModel.find();

        stocks = intersectionBy(stocks.map( stock => ({ ...stock, full_code: stock.fullCode })), variants, 'full_code');

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

        // Logging
        this.logger.log(`Done Synchronizing stocks`);

        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
        
    } catch (error) {
        // Logging
        this.logger.log(`Failed to synchronize stock keeping`);
        
        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'failed', state: false, message: JSON.stringify(error) });        
    }
  }

  async synchronizeStockKeeping(queue) {

    try {
        // Logging
        this.logger.log(`Synchronizing stock keeping`);

        let stocks =  await this.stockModel.createQueryBuilder('stocks')
                                           .leftJoinAndMapOne('stocks.variant','product_variants', 'product_variants', 'stocks.full_code = product_variants.full_code')
                                           .leftJoinAndMapOne('stocks.product','products', 'products', 'stocks.simple_code = products.simple_code')
                                           .getMany();
 
        let stock_keeping = await Promise.all(
            (await stocks).map( 
                async (stock) => {

                    let data     = { stock_id: get(stock,'id'), product_id: null, variant_id: null };
                    let product  = get(stock,'product');
                    let variant  = get(stock,'variant');
                    
                    if( !isEmpty(product) ) {
                        data.product_id = product.id; 
                    }

                    if( !isEmpty(variant) ) {
                        data.variant_id = variant.id; 
                    }

                    return data;
                }
            ),
        );

        await Promise.all(
            chunk(stock_keeping,1000).map( async (item) => {
                return new Promise( async (resolve,reject) => {
                    await this.stockKeepingModel.insert(item);
                    resolve(true);
                }) 
            })
        )

        // Logging
        this.logger.log(`Done Synchronizing stock keeping`);

        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });

    } catch (error) {

        // Logging
        this.logger.log(`Failed to synchronize stock keeping`);
        
        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'failed', state: false, message: JSON.stringify(error) });        
    }
  }
  
  @Cron(CronExpression.EVERY_10_MINUTES)
  async amrodDataSync() {

    try{
        this.logger.log(`Amrod synchronization started.`);        

        // Get amrod credentials from the configuration service
        let { credentials } = this.configService.get<any>('services.amrod');

        // Login to amrod
        await this.amrodService.login(credentials);

        let stocksUpdated: Array<any> = await this.amrodService.getUpdatedStock();
        
        // Get product variants
        let variants = await this.productVariantModel.find();

        // Match existing stocks with variants
        stocksUpdated = intersectionBy(stocksUpdated.map( stock => ({ ...stock, full_code: stock.fullCode })), variants, 'full_code');

        await this.stockModel.upsert(
            stocksUpdated.map( 
                stock => ({ 
                    full_code:         get(stock,'fullCode'), 
                    quantity:          get(stock,'stock'), 
                    reserved_quantity: get(stock,'reservedStock'), 
                    incoming_quantity: get(stock,'incomingStock'), 
                    type:              get(stock,'stockType')
                }) 
            ),
            {
                conflictPaths: ["full_code"],
                upsertType: "on-duplicate-key-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
            },
        )

        // Logging
        this.logger.log(`Amrod synchronization completed.`);        

    } catch (error) {

        // Logging
        this.logger.log(`Failed to synchronize stock keeping`);

        console.log(error);
    }

  }

}
