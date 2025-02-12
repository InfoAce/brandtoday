import { DataSource, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { ProductColourEntity, UserEntity } from 'src/entities';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
@EventSubscriber()
export class ProductColourSubscriber implements EntitySubscriberInterface<ProductColourEntity> {

    constructor(
        private dataSource: DataSource,
        @Inject('ConfigService')
        private readonly configService: ConfigService
    ){}

    listenTo() {
        return ProductColourEntity;
    }

    /**
     * Called after entity is loaded.
     */
    afterLoad(colour: ProductColourEntity){

    }

}