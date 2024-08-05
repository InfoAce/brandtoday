import { Module } from '@nestjs/common';
import { CategoryModel, ChildSubCategoryModel, SubCategoryModel } from '../models';
import { CategoryEntity, ChildSubCategoryEntity, SubCategoryEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[
    CategoryModel,
    ChildSubCategoryModel,
    SubCategoryModel
  ],
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      ChildSubCategoryEntity,
      SubCategoryEntity
    ])
  ],
  providers: [
    CategoryModel,
    ChildSubCategoryModel,
    SubCategoryModel
  ],
})
export class CategoryModule {}
