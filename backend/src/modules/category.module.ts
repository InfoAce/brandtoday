import { Module } from '@nestjs/common';
import { CategoryModel } from '../models';
import { CategoryEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[CategoryModel],
  imports: [
    TypeOrmModule.forFeature([CategoryEntity])
  ],
  providers: [CategoryModel],
})
export class CategoryModule {}
