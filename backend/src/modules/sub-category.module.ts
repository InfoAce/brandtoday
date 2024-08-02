import { Module } from '@nestjs/common';
import { SubCategoryModel } from '../models';
import { SubCategoryEntity } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports:[SubCategoryModel],
  imports: [
    TypeOrmModule.forFeature([SubCategoryEntity])
  ],
  providers: [SubCategoryModel],
})
export class SubCategoryModule {}
