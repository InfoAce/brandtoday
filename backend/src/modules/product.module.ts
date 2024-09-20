import { Module } from '@nestjs/common';
import { ProductCategoryModel,  ProductColourModel, ProductModel, ProductVariantModel } from '../models';
import { ProductCategoryEntity, ProductColourEntity, ProductEntity, ProductVariantEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[
    ProductModel,
    ProductCategoryModel,
    ProductColourModel,
    ProductVariantModel
  ],
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductVariantEntity,
      ProductCategoryEntity,
      ProductColourEntity
    ])
  ],
  providers: [
    ProductModel, 
    ProductCategoryModel,
    ProductCategoryModel,
    ProductColourModel,
    ProductVariantModel
  ],
})
export class ProductModule {}
