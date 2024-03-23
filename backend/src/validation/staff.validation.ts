import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class StaffValidation {
  @IsNotEmpty()
  first_name: string

  @IsNotEmpty()
  last_name: string

  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{ message: "Enter a valid email address."})
  email: string;

}