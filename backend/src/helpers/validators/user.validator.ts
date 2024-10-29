import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserModel } from "src/models";

export function isEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: CustomEmailvalidation,
        });
    };
}

  
@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class CustomEmailvalidation implements ValidatorConstraintInterface {
    constructor(private readonly userModel: UserModel) {}
  
    async validate(value: string): Promise<boolean> {
        try {
            await this.userModel.findOneOrFail({ where: { email: value } });
            return false;
        } catch(error) {
            return true;
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Email already exists';
    }
  }