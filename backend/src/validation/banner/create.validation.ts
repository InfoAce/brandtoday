import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBannerValidation {

    @IsString()
    @IsNotEmpty()
    path: string    

}