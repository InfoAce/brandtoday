import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAboutUsValidation {

    @IsString()
    @IsNotEmpty()
    about_us: string

}