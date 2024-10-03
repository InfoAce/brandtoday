import { AfterInsert, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { PriceEntity } from 'src/entities';
import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';

@Injectable()
@EventSubscriber()
export class PriceSubscriber implements EntitySubscriberInterface<PriceEntity> {
    
    listenTo() {
        return PriceEntity;
    }

    /**
     * Called after entity is loaded.
     */
    async afterLoad(price: PriceEntity) {
        
        if( !isEmpty(price.company)){
            if( price.company.use_exchange_rate ){
                price.amount = price.amount * price.company.exchange_rate
            }
    
            if( price.company.use_product_fee ){
                switch(price.company.product_fee_type){
                    case 'fixed':
                        price.amount = price.amount + price.company.product_fee;
                    break;
                    case 'percentage':
                        price.amount += ((price.amount * price.company.product_fee)/100);
                    break;
                }
            }
        }

        return price;

    }


}