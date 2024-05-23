import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateBannerValidation {

    @IsNotEmpty()
    @IsArray()
    banners: any

}