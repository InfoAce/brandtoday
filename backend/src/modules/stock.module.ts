import { Module } from '@nestjs/common';
import { StockKeepingModel, StockModel } from '../models';
import { StockEntity, StockKeepingEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[StockModel,StockKeepingModel],
  imports: [
    TypeOrmModule.forFeature([StockEntity,StockKeepingEntity])
  ],
  providers: [StockModel,StockKeepingModel],
})
export class StockModule {}
