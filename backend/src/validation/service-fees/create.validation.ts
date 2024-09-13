import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceFeeValidation {

    @IsNumber()
    @IsNotEmpty()
    amount: string   

    @IsString()
    @IsNotEmpty()
    name: string   

    @IsString()
    @IsNotEmpty()
    type: string   

}