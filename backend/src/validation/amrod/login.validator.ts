import { IsEmail, IsNotEmpty } from 'class-validator';

export class AmrodLoginValidation {

    @IsNotEmpty()
    CustomerCode: string;

    @IsEmail()
    @IsNotEmpty()
    UserName: string;

    @IsNotEmpty()
    Password: string;
}