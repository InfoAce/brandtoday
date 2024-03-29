import { IsNotEmpty, IsString } from 'class-validator';

export class WishlistValidation {

  @IsNotEmpty()
  @IsString()
  product_code: string

  @IsNotEmpty()
  @IsString()
  content: string

}