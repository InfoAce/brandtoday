import { AfterInsert, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { OrderEntity } from 'src/entities';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from 'src/events';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<OrderEntity> {

    constructor(
        @Inject(EventEmitter2) private eventEmitter: EventEmitter2
    ) {}
    
    listenTo() {
        return OrderEntity;
    }

    /**
     * Called after entity is loaded.
     */
    async afterLoad(order: OrderEntity) {

    }

    /**
     * Called after entity is inserted.
     * 
     * @param {InsertEvent<OrderEntity>} event - The event containing the inserted entity.
     */
    async afterInsert({ entity: order }: InsertEvent<OrderEntity>){
    }
    


}