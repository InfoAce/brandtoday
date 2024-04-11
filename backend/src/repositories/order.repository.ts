import { Repository } from 'typeorm';
import { OrderEntity } from '../entities'

export class OrderRepository extends Repository<OrderEntity>{}