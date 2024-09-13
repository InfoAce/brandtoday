import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateServiceFeeValidation {

    @IsNotEmpty()
    @IsArray()
    service_fees: any

}