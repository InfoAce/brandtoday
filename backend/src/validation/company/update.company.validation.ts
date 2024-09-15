import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

    @IsOptional()
    @IsString()
    icon:string

    @IsOptional()
    @IsString()
    logo: string

    @IsOptional()
    @IsString()
    white_logo: string

    @IsNotEmpty()
    @IsString()
    phone_number: string
}