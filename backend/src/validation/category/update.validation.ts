import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryUpdateValidation {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    path: string 

}