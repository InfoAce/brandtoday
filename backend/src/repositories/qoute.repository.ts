import { Repository } from 'typeorm';
import { QuoteEntity } from '../entities'

export class QuoteRepository extends Repository<QuoteEntity>{}