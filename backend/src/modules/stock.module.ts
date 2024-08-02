import { Module } from '@nestjs/common';
import { StockModel } from '../models';
import { StockEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[StockModel],
  imports: [
    TypeOrmModule.forFeature([StockEntity])
  ],
  providers: [StockModel],
})
export class StockModule {}
