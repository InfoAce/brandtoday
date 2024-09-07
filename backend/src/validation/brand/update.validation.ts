import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateBrandValidation {

    @IsNotEmpty()
    @IsArray()
    brands: any

}