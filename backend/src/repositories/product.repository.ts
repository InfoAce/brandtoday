import { Repository } from 'typeorm';
import { ProductEntity } from '../entities'

export class ProductRepository extends Repository<ProductEntity>{}