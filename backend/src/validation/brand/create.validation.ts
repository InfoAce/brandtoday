import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandValidation {

    @IsString()
    @IsNotEmpty()
    path: string    

}