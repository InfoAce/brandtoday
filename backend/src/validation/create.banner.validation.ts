import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBannerValidation {

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    path: string
    
    @IsString()
    @IsNotEmpty()
    title: string

}