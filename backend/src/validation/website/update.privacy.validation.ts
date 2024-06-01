import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePrivacyPolicyValidation {

    @IsString()
    @IsNotEmpty()
    privacy_policy: string

}