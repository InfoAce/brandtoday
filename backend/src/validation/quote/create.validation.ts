import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuoteValidation {

    @IsString()
    @IsNotEmpty()
    colour: string

    @IsString()
    @IsNotEmpty()
    full_code: string

    @IsString()
    @IsNotEmpty()
    hex: string

    @IsString()
    @IsNotEmpty()
    image: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsArray()
    @IsOptional()
    sizes: any = Array()

}