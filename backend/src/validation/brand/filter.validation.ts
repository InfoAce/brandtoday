import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class FilterBrandValidation {

    @IsOptional()
    @IsArray()
    brands: any

    @IsOptional()
    @IsBoolean()
    with_products: boolean

    @IsOptional()
    @IsBoolean()
    categorized: boolean

    @ValidateIf( item => item.categorized )
    @IsString()
    @IsNotEmpty()
    category: string

    @ValidateIf( item => item.categorized )
    @IsString()
    @IsNotEmpty()
    sub_category: string

    @ValidateIf( item => item.categorized )
    @IsString()
    @IsOptional()
    child_sub_category: string
}