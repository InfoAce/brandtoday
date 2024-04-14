import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModel } from '../models';
import { TransactionEntity } from '../entities';

@Module({
  exports:[TransactionModel],
  imports: [
    TypeOrmModule.forFeature([TransactionEntity])
  ],
  providers: [TransactionModel],
})
export class TransactionModule {}
