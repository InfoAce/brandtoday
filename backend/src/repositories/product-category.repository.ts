import { Repository } from 'typeorm';
import { ProductCategoryEntity } from '../entities'

export class ProductCategoryRepository extends Repository<ProductCategoryEntity>{}