import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isEmpty } from 'lodash';

export class FetchProductsValidation {

    @Transform(({ value }) => !isEmpty(value) ? value.map( item => item.toLowerCase()) : value )
    @IsArray()
    @IsOptional()
    brands: any = []

    @Transform(({ value }) => !isEmpty(value) ? value.map( item => item.toLowerCase()) : value )
    @IsArray()
    @IsOptional()
    child_sub_categories: any = []

    @Transform(({ value }) => value)
    @IsArray()
    @IsOptional()
    price: any =  [1,2000]
    
}