import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class Item {
    @IsString()
    @IsOptional()
    colour: string

    @IsString()
    @IsNotEmpty()
    full_code: string

    @IsString()
    @IsOptional()
    hex: string

    @IsString()
    @IsNotEmpty()
    image: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsArray()
    @IsOptional()
    positions: any = Array()

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsArray()
    @IsOptional()
    sizes: any = Array()

    @IsNumber()
    @IsNotEmpty()
    total_amount: number

    @IsNumber()
    @IsNotEmpty()
    total_quantity: number
}

export class CreateQuoteValidation {

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => Item)
    items: Item[]

}