import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities'

export class CategoryRepository extends Repository<CategoryEntity>{}