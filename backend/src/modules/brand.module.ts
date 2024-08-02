import { Module } from '@nestjs/common';
import { BrandModel } from '../models';
import { BrandEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[BrandModel],
  imports: [
    TypeOrmModule.forFeature([BrandEntity])
  ],
  providers: [BrandModel],
})
export class BrandModule {}
