import { IsArray, IsNotEmpty, IsString, MIN } from 'class-validator';

export class CreateOrderValidation {

    @IsString()
    @IsNotEmpty()
    address: string

    @IsArray()
    @IsNotEmpty()
    items: any

}