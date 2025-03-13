import { Module } from '@nestjs/common';
import { BrandingModel, BrandingMethodModel, BrandingPriceModel, ProductCategoryModel,  ProductColourModel, ProductModel, ProductVariantModel, ColourModel } from '../models';
import { BrandingEntity, BrandingMethodEntity, BrandingPriceEntity, ColourEntity, ProductCategoryEntity, ProductColourEntity, ProductEntity, ProductVariantEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductColourSubscriber } from 'src/subscribers';

@Module({
  exports:[
    BrandingModel,
    BrandingMethodModel,
    BrandingPriceModel,
    ColourModel,
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
      ColourEntity,
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
    ColourModel,
    ProductModel, 
    ProductCategoryModel,
    ProductCategoryModel,
    ProductColourModel,
    ProductVariantModel
  ],
})
export class ProductModule {}
