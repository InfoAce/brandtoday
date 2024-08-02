import { Repository } from 'typeorm';
import { StockEntity } from '../entities'

export class StockRepository extends Repository<StockEntity>{}