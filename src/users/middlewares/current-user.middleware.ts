import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { User } from "../user.entity";
import { UsersService } from "../users.service";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User; // This will add aditional property to the Request of Express --> Adds property of 'currentUser'.
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService){}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {}

        if(userId) {
            const user =await this.usersService.findOne(userId);
            req.currentUser = user;
        }
        next();
    }
}

//@ts-ignore //<---- this comment is used to tell typescript to ignore the error in line below.