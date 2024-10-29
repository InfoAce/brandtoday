import { AfterInsert, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { StockEntity } from 'src/entities';
import { Injectable } from '@nestjs/common';
import { isEmpty, set } from 'lodash';

@Injectable()
@EventSubscriber()
export class StockSubscriber implements EntitySubscriberInterface<StockEntity> {
    
    listenTo() {
        return StockEntity;
    }

    /**
     * Called after entity is loaded.
     */
    async afterLoad(stock: StockEntity) {
        
        stock.quantity = stock.reserved_quantity > stock.quantity ? 0 : stock.quantity - stock.reserved_quantity;
        return stock;
    }


}