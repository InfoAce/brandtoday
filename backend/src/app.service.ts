import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmrodService, MailService } from './services';
import { ConfigService } from '@nestjs/config';
import { sep } from 'path';
import { cloneDeep, chunk, isEmpty, isNull, flatten, get, groupBy, map, maxBy, take, intersectionBy, uniqBy } from 'lodash';
import { BrandModel, CategoryModel, ChildSubCategoryModel, CompanyModel, PriceModel, ProductCategoryModel, ProductColourModel, ProductModel, ProductVariantModel, QueueModel, StockModel, SubCategoryModel, SubChildSubCategoryModel, UserModel } from 'src/models';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs'
@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  private readonly sleep  = new Promise( (resolve) => setTimeout(resolve, 1000) );

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
    private subCategoryModel:     SubCategoryModel,
    private subChildSubCategory:  SubChildSubCategoryModel,
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
              }
            })
          );
        }
      } catch(error) {
        this.logger.log(error);
      }
  }

  async synchronizeBrands(queue) {
    
    // Logging
    this.logger.log(`Synchronizing brands`);

    // Fetch amrod brands
    let brands = await this.amrodService.getBrands(); 

    await Promise.all(
      chunk(brands,500).map( async (brands) => {
        await this.brandModel.upsert(
            brands.map( 
                ({ code, image, name}) => 
                    ({ code, name, image }) 
            ),
            {
                conflictPaths: ["code"],
                upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
            },
        );
      })
    )

    // Logging
    this.logger.log(`Done Synchronizing brands`);

    // Update queue status
    await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
  }

  async synchronizeCategories(queue) {
    try{
        // Logging
        this.logger.log(`Synchronizing categories`);

        // Fetch amrod product categories
        let categories               = (await this.amrodService.getCategories()).map( category => ({ ...category }));  
        let sub_categories           = categories.map( category => category.children.map( sub_category => ({ ...sub_category, category_code: category.categoryName.toLowerCase().replace(/\s/g, ''), children: sub_category.children, }) ) ).flat();    
        let child_sub_categories     = sub_categories.map( sub_category => sub_category.children.map( child_sub_category => ({ ...child_sub_category, category_code: sub_category.categoryName.toLowerCase().replace(/\s/g, ''), }) ) ).flat();
        let sub_child_sub_categories = child_sub_categories.map( child_sub_category => child_sub_category.children.map( sub_child_sub_category => ({ ...sub_child_sub_category, category_code: child_sub_category.categoryName.toLowerCase().replace(/\s/g, ''), }) ) ).flat();
        
        await Promise.all(
            chunk(categories,500).map( async (categories) => {
                await this.categoryModel.upsert(
                    categories.map( 
                        ({categoryName: name, categoryCode, categoryPath: path }) => 
                            ({ code: categoryCode.replace(/\s/g, '').toLowerCase(), name, path}) 
                    ),
                    {
                        conflictPaths: ["code"],
                        upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                    },
                )
            })
        )

        await Promise.all(
            chunk(sub_categories,500).map( async (sub_categories) => {
                await this.subCategoryModel.upsert(
                    sub_categories.map( 
                        ({categoryName: name, categoryPath: path, category_code }) => 
                            ({ code: name.replace(/\s/g, '').toLowerCase(), name, path, category_code}) 
                    ),
                    {
                        conflictPaths: ["path"],
                        upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                    },
                )
            })
        )

        await Promise.all(
            chunk(child_sub_categories,500).map( async (child_sub_categories) => {
                await this.childSubCategory.upsert(
                    child_sub_categories.map( 
                        ({categoryName: name, categoryPath: path, category_code }) => 
                            ({ code: name.replace(/\s/g, '').toLowerCase(), name, path, category_code }) 
                    ),
                    {
                        conflictPaths: ["path"],
                        upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                    },
                )
            })
        )

        await Promise.all(
            chunk(sub_child_sub_categories,500).map( async (sub_child_sub_categories) => {
                await this.subChildSubCategory.upsert(
                    sub_child_sub_categories.map( 
                        ({categoryName: name, categoryPath: path, category_code }) => 
                            ({ code: name.replace(/\s/g, '').toLowerCase(), name, path, category_code }) 
                    ),
                    {
                        conflictPaths: ["path"],
                        upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                    },
                )
            })
        )

        // Logging
        this.logger.log(`Done Synchronizing categories`);

        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });

        // Update queue status
        await this.queueModel.updateOne({ type: 'products' },{ status: 'waiting', state: true });
    } catch(error) {
        console.log(error);
    }
  }

  async synchronizeProducts(queue) {
    try{
        // Logging
        this.logger.log(`Synchronizing products`);

        // Fetch amrod products
        let products = await this.amrodService.getProducts()  

        let company  = await this.companyModel.first();

        // Fetch amrod prices  
        let prices   = await this.amrodService.getPrices();  

        products = products.map( product => {
            let full_code     = product.fullCode.split('-');
            let productPrices = prices.filter( price => price.simplecode.includes(`${full_code[0]}-${full_code[1]}`) );
            let maxPrice      = get(maxBy( productPrices,'price'),'price');
            return { ...product, price: maxPrice, code: product.productName.toLowerCase().replace(/\s/g, '') }
        });

        let product_categories  = uniqBy(products,'code').map( 
            product => product.categories.map( 
                category => {
                    let path = category.path.split('/');
                    if( path.length == 4 ) {
                        return {  
                            category_code:               path[0].toLowerCase().replace(/\s/g, ''), 
                            sub_category_code:           path[1].toLowerCase().replace(/\s/g, ''),
                            child_sub_category_code:     path[2].toLowerCase().replace(/\s/g, ''),
                            sub_child_sub_category_code: path[3].toLowerCase().replace(/\s/g, ''),
                            path:                        `${path.join('-')}-${product.fullCode}`,
                            product_code:                product.fullCode 
                        }
                    }        
                    if( path.length == 3 ) {
                        return {  
                            category_code:           path[0].toLowerCase().replace(/\s/g, ''), 
                            sub_category_code:       path[1].toLowerCase().replace(/\s/g, ''),
                            child_sub_category_code: path[2].toLowerCase().replace(/\s/g, ''),
                            path:                    `${path.join('-')}-${product.fullCode}`,
                            product_code:            product.fullCode 
                        }
                    }
                    if( path.length == 2) {
                        return {  
                            category_code:     path[0].toLowerCase().replace(/\s/g, ''), 
                            sub_category_code: path[1].toLowerCase().replace(/\s/g, ''),
                            path:              `${path.join('-')}-${product.fullCode}`,
                            product_code:      product.fullCode 
                        }
                    }
                    if( path.length == 1) {
                        return { 
                            category_code: path[0].toLowerCase().replace(/\s/g, ''), 
                            path:         `${path.join('-')}-${product.fullCode}`,
                            product_code:  product.fullCode 
                        }
                    }
                }
            ) 
        )
        .flat()
        .filter( category => category instanceof Object );

        product_categories = uniqBy(product_categories,'path');

        let colour_images = products.filter( product => !isNull(product.colourImages) ).map( product => product.colourImages.map( images => ({...images, product_code: product.fullCode })) ).flat().map( colour => ({ ...colour, id: uuidv4(), simple_code: `${colour.product_code}-${colour.code}` }) );

        await Promise.all(
            chunk(uniqBy(products,'code'),1).map( async (products) => {
                await this.productModel.upsert(
                    products.map( 
                        ({ brand, fullCode: full_code, price, simpleCode: simple_code, gender, images, variants, brandingTemplates: branding_templates, fullBrandingGuide: full_branding_guide, logo24BrandingGuide: logo_branding_guide, description, productName: name, companionCodes: companion_codes }) => 
                            ({ brand: !isNull(brand) ? brand.code : null, code: name.toLowerCase().replace(/\s/g, ''), full_code, company_id: company.id, price, simple_code, gender, branding_templates, variants, images, companion_codes, description, full_branding_guide, logo_branding_guide, name }) 
                    ),
                    {
                        conflictPaths: ["code"],
                        upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                    },
                );
                await this.sleep;
            })
        )

        // Logging
        this.logger.log(`Done saving products`);

        await Promise.all(
            chunk(colour_images,1).map( async (colour) => {
                await this.productColourModel.upsert(
                    colour.map( 
                        ({ name, images, code, product_code, simple_code }) => 
                            ({ name, images, code, product_code, simple_code }) 
                    ),
                    {
                        conflictPaths: ["code"],
                        upsertType: "on-duplicate-key-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                    },
                );
                await this.sleep;
            })
        )

        // Logging
        this.logger.log(`Done saving product colours`);
        
        await Promise.all(
            chunk(product_categories,1).map( 
                async (product_categories) => {
                    await this.productCategoryModel.upsert(
                        product_categories,
                        {
                            conflictPaths: ["path"],
                            upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                        },
                    );
                    await this.sleep;
                }
            )
        )

        // Logging
        this.logger.log(`Done saving product categories`);

        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });

        await this.queueModel.updateOne({ type: 'product_variants'},{ status: 'waiting', state: true });

    } catch (error) {

        console.log(error);

        // Logging
        this.logger.log(`Failed to synchronize products`);
        
        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'failed', state: false, message: JSON.stringify(error) });        
    }
  }

  
  async synchronizeProductVariants(queue) {
    try{
        // Logging
        this.logger.log(`Synchronizing product variants`);

        // Fetch amrod products
        let products = await this.amrodService.getProducts(); 
        products     = uniqBy(products.map( product => ({ ...product, code: product.productName.toLowerCase().replace(/\s/g, '') })),'code');

        let variants = products.map( product => product.variants )
                              .flat()
                              .map( (variant) => {
                                return { 
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
                              });

                            
        await Promise.all(
            variants.map( async (variant) => {
                await this.productVariantModel.upsert(
                    variant,
                    {
                        conflictPaths: ["full_code"],
                        upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                    },
                )
                await this.sleep;
            })
        );


        // Logging
        this.logger.log(`Done Synchronizing product variants`);

        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });

        await this.queueModel.updateOne({ type: 'prices'},{ status: 'waiting', state: true });
        
        await this.queueModel.updateOne({ type: 'stocks'},{ status: 'waiting', state: true });

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

    // Fetch product variants
    let variants       = await this.productVariantModel.find(); 

    // Fetch amrod prices
    let prices         = await this.amrodService.getPrices();  
    let company        = await this.companyModel.first(); 

    await Promise.all(
        chunk(
            uniqBy(intersectionBy(prices.map( price => ({ ...price, full_code: price.fullCode })),variants,'full_code'),'full_code'),
            1
        ).map( async (prices) => {
            await this.priceModel.upsert( 
                prices.map( 
                    ({ full_code, simplecode: simple_code, price: amount }) => 
                        ({ full_code, simple_code, amount, company_id: company.id })
                ),
                {
                    conflictPaths: ["full_code"],
                    upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                },
            );
            await this.sleep;
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
        let stocks   = await this.amrodService.getStock();

        // Get product variants
        let variants = await this.productVariantModel.find();

        stocks = intersectionBy(stocks.map( stock => ({ ...stock, full_code: stock.fullCode })), variants, 'full_code');

        await Promise.all(
            chunk(stocks,1).map( async (stocks) => {
                await this.stockModel.upsert( 
                    stocks.map( 
                        ({simpleCode: simple_code, fullCode: full_code, stockType: type, stock: quantity, reservedStock: reserved_quantity, incomingStock: incoming_quantity, colourCode: colour_code }) => {
                            return { simple_code, full_code, type, quantity, reserved_quantity, incoming_quantity, colour_code }
                        }
                    ),
                    {
                        conflictPaths: ["full_code"],
                        upsertType: "on-conflict-do-update", //  "on-conflict-do-update" | "on-duplicate-key-update" | "upsert" - optionally provide an UpsertType - 'upsert' is currently only supported by CockroachDB
                    },
                )
                await this.sleep;
            })
        );

        // Logging
        this.logger.log(`Done Synchronizing stocks`);

        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });
        
    } catch (error) {
        console.log(error);

        // Logging
        this.logger.log(`Failed to synchronize stocks`);
        
        // Update queue status
        await this.queueModel.updateOne({ id: queue.id},{ status: 'failed', state: false, message: JSON.stringify(error) });        
    }
  }

//   async synchronizeStockKeeping(queue) {

//     try {
//         // Logging
//         this.logger.log(`Synchronizing stock keeping`);

//         let stocks =  await this.stockModel.createQueryBuilder('stocks')
//                                            .leftJoinAndMapOne('stocks.variant','product_variants', 'product_variants', 'stocks.full_code = product_variants.full_code')
//                                            .leftJoinAndMapOne('stocks.product','products', 'products', 'stocks.simple_code = products.simple_code')
//                                            .getMany();
 
//         let stock_keeping = await Promise.all(
//             (await stocks).map( 
//                 async (stock) => {

//                     let data     = { stock_id: get(stock,'id'), product_id: null, variant_id: null };
//                     let product  = get(stock,'product');
//                     let variant  = get(stock,'variant');
                    
//                     if( !isEmpty(product) ) {
//                         data.product_id = product.id; 
//                     }

//                     if( !isEmpty(variant) ) {
//                         data.variant_id = variant.id; 
//                     }

//                     return data;
//                 }
//             ),
//         );

//         await Promise.all(
//             chunk(stock_keeping,1000).map( async (item) => {
//                 return new Promise( async (resolve,reject) => {
//                     await this.stockKeepingModel.insert(item);
//                     resolve(true);
//                 }) 
//             })
//         )

//         // Logging
//         this.logger.log(`Done Synchronizing stock keeping`);

//         // Update queue status
//         await this.queueModel.updateOne({ id: queue.id},{ status: 'complete', state: false });

//     } catch (error) {

//         // Logging
//         this.logger.log(`Failed to synchronize stock keeping`);
        
//         // Update queue status
//         await this.queueModel.updateOne({ id: queue.id},{ status: 'failed', state: false, message: JSON.stringify(error) });        
//     }
//   }
  
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async amrodDataSyncDaily() {

    try{
        this.logger.log(`Full amrod data synchronization started.`);        

        await this.queueModel.updateOne({ type: 'categories'},{ status: 'waiting', state: true });  

        // Logging
        this.logger.log(`Full amrod data synchronization completed.`);        

    } catch (error) {

        // Logging
        this.logger.log(`Failed to synchonize full amrod data`);
    }

  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async amrodDataSyncTenMins() {

    try{
        this.logger.log(`Partial amrod data synchronization started.`);        

        // Get amrod credentials from the configuration service
        let { credentials } = this.configService.get<any>('services.amrod');

        // Login to amrod
        await this.amrodService.login(credentials);

        let stocksUpdated: Array<any> = await this.amrodService.getUpdatedStock();

        this.logger.log(`Synchronizing updated stocks`);   
        
        // Get product variants
        let variants = await this.productVariantModel.find();

        // Match existing stocks with variants
        stocksUpdated = intersectionBy(stocksUpdated.map( stock => ({ ...stock, full_code: stock.fullCode })), variants, 'full_code');

        await this.stockModel.upsert(
            stocksUpdated.map( 
                stock => ({ 
                    simple_code:       get(stock,'simpleCode'), 
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

        this.logger.log(`Done synchronizing updated stocks`);        

        // Logging
        this.logger.log(`Partial amrod data synchronization completed.`);        

    } catch (error) {

        // Logging
        this.logger.log(`Failed to synchronize partial amrod data`);
    }

  }

}
