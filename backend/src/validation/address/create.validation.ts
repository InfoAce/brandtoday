import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressValidation {

    @IsString()
    @IsNotEmpty()
    address_line_1: string

    @IsString()
    address_line_2: string
    
    @IsString()
    @IsNotEmpty()
    county_state: string

    @IsString()
    @IsNotEmpty()
    country: string

    @IsString()
    @IsNotEmpty()
    postal_code: string

    @IsString()
    @IsNotEmpty()
    city_town: string

    @IsString()
    @IsNotEmpty()
    category: string

}