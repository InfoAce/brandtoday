import { Module } from '@nestjs/common';
import { ProductCategoryModel, ProductModel, ProductVariantModel } from '../models';
import { ProductCategoryEntity, ProductEntity, ProductVariantEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[
    ProductModel,
    ProductCategoryModel,
    ProductVariantModel
  ],
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductVariantEntity,
      ProductCategoryEntity
    ])
  ],
  providers: [
    ProductModel, 
    ProductCategoryModel,
    ProductVariantModel
  ],
})
export class ProductModule {}
