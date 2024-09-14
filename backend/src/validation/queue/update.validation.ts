import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateQueueValidation  {

  @IsNotEmpty()
  @IsBoolean()
  state: boolean

}