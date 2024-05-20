import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { OrderEntity } from 'src/entities';
import { omit } from 'lodash';
import { BeforeQueryEvent } from 'typeorm/subscriber/event/QueryEvent';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<OrderEntity> {

    listenTo() {
        return OrderEntity;
    }

    /**
     * Called after entity is loaded.
     */
    async afterLoad(entity: any) {

    }


}