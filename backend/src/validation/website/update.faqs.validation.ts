import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFaqsValidation {

    @IsString()
    @IsNotEmpty()
    faqs: string

}