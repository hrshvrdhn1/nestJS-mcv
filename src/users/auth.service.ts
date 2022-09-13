import { User } from './user.entity';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _ascrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_ascrypt);

@Injectable()
export class AuthService{
    constructor(private usersService: UsersService){ 
    }

    async signUp(email: string, password: string){
        // See if email is already registered.
        const users = await this.usersService.find(email);
        if(users.length) {
            throw new BadRequestException('Email already registered');
        }
    //Generate a salt.
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and password together.
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //Join the hashed result and salt together.
    const result = salt + '.' + hash.toString('hex');

    //Create new user and save it.
    const user = await this.usersService.create(email, result);

    // Return the user.
    return user;
    }

    async signIn(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if(!user) {
            throw new NotFoundException('user not found');
        }
        const [salt, hashOfStoredPassword] = user.password.split('.');
        const hashOfEnteredPassword = (await scrypt(password, salt, 32)) as Buffer;
        
        if(hashOfStoredPassword !== hashOfEnteredPassword.toString('hex')) {
            throw new BadRequestException('Incorrect Password');
        }
        return user;
    }
}