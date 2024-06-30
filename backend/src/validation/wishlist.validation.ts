import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class WishlistValidation {

  @IsNotEmpty()
  @IsString()
  product_code: string

  @IsNotEmpty()
  @IsObject()
  content: object

}