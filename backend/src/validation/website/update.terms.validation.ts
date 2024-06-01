import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTermsAndConditionsValidation {

    @IsString()
    @IsNotEmpty()
    terms_conditions: string

}