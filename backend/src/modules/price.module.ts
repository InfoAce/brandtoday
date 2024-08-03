import { Module } from '@nestjs/common';
import { PriceModel } from '../models';
import { PriceEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[PriceModel],
  imports: [
    TypeOrmModule.forFeature([PriceEntity])
  ],
  providers: [PriceModel],
})
export class PriceModule {}
