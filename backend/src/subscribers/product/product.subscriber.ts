import { AfterInsert, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { ProductEntity } from 'src/entities';
import { Inject, Injectable } from '@nestjs/common';
import { isEmpty, set } from 'lodash';
import { parse } from 'path';

@Injectable()
@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<ProductEntity> {
    
    listenTo() {
        return ProductEntity;
    }

    /**
     * Called after entity is loaded.
     */
    async afterLoad(product: ProductEntity) {
        
        if( !isEmpty(product.company)){
            
            if( product.company.use_exchange_rate ){
                product.price = product.price * product.company.exchange_rate
            }

    
            if( product.company.use_product_fee ){
                switch(product.company.product_fee_type){
                    case 'fixed':
                        product.price = (product.price + product.company.product_fee);
                    break;
                    case 'percentage':
                        product.price = (product.price * (product.company.product_fee/100));
                    break;
                }
            }

        }
        
        return product;

    }


}