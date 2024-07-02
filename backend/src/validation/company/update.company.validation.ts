import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCompanyValidation {

    @IsNotEmpty()
    @IsString()
    address: string

    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    email:string

    @IsNotEmpty()
    @IsString()
    icon:string

    @IsNotEmpty()
    @IsString()
    logo: string

    @IsNotEmpty()
    @IsString()
    phone_number: string
}