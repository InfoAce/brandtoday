import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';

class Item {
    @IsString()
    @IsOptional()
    colour: string

    @IsString()
    @IsNotEmpty()
    full_code: string

    @IsArray()
    @IsOptional()
    hex: any

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

    @IsEmail()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{ message: "Enter a valid email address."})
    email: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => Item)
    items: Item[]
    
    @IsString()
    @IsNotEmpty()
    name: string

}