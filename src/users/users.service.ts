import { User } from './user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    create(email: string, password: string){
        const user =  this.repo.create({ email, password });
        console.log('Creating user entity instance from users.service.ts through create() method and saving it in sqlite through save() method')
        return this.repo.save(user);
        //we can even do -  __.save( { email, password } ) <- This will not execute Hooks so its not the best way.
        //In the upper method - __.save(user) <- we pass in the entity which executes the hooks which is a preffered way. 
    }

    findOne(id: number){
        if(!id) {
            return null;
        }
        return this.repo.findOne({ where: {id: id} });
    }

    find(email: string){
        return this.repo.find({ where: {email: email} });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if(!user) { throw new NotFoundException(`User with  id: ${id} not found`) }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number){
        const user = await this.findOne(id);
        if(!user) { throw new NotFoundException(`User with ${id} already not there !`) }
        return this.repo.remove(user);
    }
}
