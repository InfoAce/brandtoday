import { Module } from '@nestjs/common';
import { BrandingModel, BrandingMethodModel, BrandingPriceModel, ProductCategoryModel,  ProductColourModel, ProductModel, ProductVariantModel } from '../models';
import { BrandingEntity, BrandingMethodEntity, BrandingPriceEntity, ProductCategoryEntity, ProductColourEntity, ProductEntity, ProductVariantEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductColourSubscriber } from 'src/subscribers';

@Module({
  exports:[
    BrandingModel,
    BrandingMethodModel,
    BrandingPriceModel,
    ProductModel,
    ProductCategoryModel,
    ProductColourModel,
    ProductVariantModel
  ],
  imports: [
    TypeOrmModule.forFeature([
      BrandingEntity,
      BrandingMethodEntity,
      BrandingPriceEntity,
      ProductEntity,
      ProductVariantEntity,
      ProductCategoryEntity,
      ProductColourEntity
    ])
  ],
  providers: [
    BrandingModel,
    BrandingPriceModel,
    BrandingMethodModel,
    ProductModel, 
    ProductCategoryModel,
    ProductCategoryModel,
    ProductColourModel,
    ProductVariantModel
  ],
})
export class ProductModule {}
