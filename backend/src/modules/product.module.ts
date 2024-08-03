import { Module } from '@nestjs/common';
import { ProductCategoryModel, ProductModel } from '../models';
import { ProductCategoryEntity, ProductEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[
    ProductModel,
    ProductCategoryModel
  ],
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductCategoryEntity
    ])
  ],
  providers: [
    ProductModel, 
    ProductCategoryModel
  ],
})
export class ProductModule {}
