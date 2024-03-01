import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserEntity } from "src/entities";
import { UserModel } from "src/models";

@Injectable()
export class SessionSerialize extends PassportSerializer {

    constructor(
        private userModel: UserModel
    ){
        super();
    }

    serializeUser(user: any, done: Function) {
        done(null, user)
    }

    async deserializeUser({ id }: UserEntity, done: Function) {
        const user = await this.userModel.findOneBy({id});
        return user ? done(null, user) : done(null,null);
    }
}