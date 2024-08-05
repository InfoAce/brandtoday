import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateContactUsValidation {

    @IsString()
    @IsNotEmpty()
    contact_us: string

}