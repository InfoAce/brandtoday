import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FetchProductsValidation {

    @Transform(({ value }) => value)
    @IsArray()
    @IsOptional()
    brands: any = []

    @Transform(({ value }) => value)
    @IsArray()
    @IsOptional()
    price: any =  [1,2000]
    
}