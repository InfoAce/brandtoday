import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReturnRefundsValidation {

    @IsString()
    @IsNotEmpty()
    return_refunds: string

}