import { Module } from '@nestjs/common';
import { CategoryModel, ChildSubCategoryModel, SubCategoryModel, SubChildSubCategoryModel } from '../models';
import { CategoryEntity, ChildSubCategoryEntity, SubCategoryEntity, SubChildSubCategoryEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[
    CategoryModel,
    ChildSubCategoryModel,
    SubCategoryModel,
    SubChildSubCategoryModel
  ],
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      ChildSubCategoryEntity,
      SubCategoryEntity,
      SubChildSubCategoryEntity
    ])
  ],
  providers: [
    CategoryModel,
    ChildSubCategoryModel,
    SubCategoryModel,
    SubChildSubCategoryModel
  ],
})
export class CategoryModule {}
