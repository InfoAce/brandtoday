import { Repository } from 'typeorm';
import { OrderItemEntity } from '../entities'

export class OrderItemRepository extends Repository<OrderItemEntity>{}