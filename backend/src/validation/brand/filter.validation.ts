import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class FilterBrandValidation {

    @IsOptional()
    @IsArray()
    brands: any

    @IsOptional()
    @IsBoolean()
    with_products: boolean

    @ValidateIf( item => item.with_products )
    @IsString()
    @IsNotEmpty()
    category: string

    @ValidateIf( item => item.with_products )
    @IsString()
    @IsNotEmpty()
    sub_category: string
}