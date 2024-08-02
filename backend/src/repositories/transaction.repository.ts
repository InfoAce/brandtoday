import { Repository } from 'typeorm';
import { TransactionEntity } from '../entities'

export class TransactionRepository extends Repository<TransactionEntity>{}