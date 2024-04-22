import { IsEmail, Matches, MaxLength, MinLength ,IsArray, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateOrderValidation {
    @IsString()
    @IsNotEmpty()
    type: string

    @IsArray()
    @IsNotEmpty()
    items: any

    @ValidateIf( item => item.type == 'existing' )
    @IsString()
    @IsNotEmpty()
    address_id: string

    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    first_name: string
  
    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    last_name: string
  
    @ValidateIf( item => item.type == 'new' )
    @IsEmail()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{ message: "Enter a valid email address."})
    email: string;
  
    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak.'})
    password: string;
  
    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    phone_number: string

    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    currency: string    
  
    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    @MinLength(4,{message:"Password confirmation should not be less than 4 characters." })
    @Matches(CreateOrderValidation['password'],{message: "Password confirmation should match the password."})
    confirm_password: string;

    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    address_line_1: string

    @ValidateIf( item => item.type == 'new' )
    @IsString()
    address_line_2: string

    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    postal_code: string

    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    country: string

    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    county_state: string

    @ValidateIf( item => item.type == 'new' )
    @IsNotEmpty()
    @IsString()
    city_town: string
    
}