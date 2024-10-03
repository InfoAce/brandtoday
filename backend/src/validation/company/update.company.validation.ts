import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

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

    @ValidateIf( value => value.use_exchange_rate === true )
    @IsOptional()
    @IsNumber()
    exchange_rate: number

    @ValidateIf( value => value.use_product_fee === true )
    @IsOptional()
    @IsNumber()
    product_fee: number

    @ValidateIf( value => value.use_product_fee === true )
    @IsOptional()
    @IsString()
    product_fee_type: string

    @IsNotEmpty()
    @IsBoolean()
    use_exchange_rate: boolean

    @IsNotEmpty()
    @IsBoolean()
    use_product_fee: boolean
}