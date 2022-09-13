import { Body,
     Session, 
     Controller, 
     Delete, 
     Get, 
     Param, 
     Patch, 
     Post, 
     Query, 
     NotFoundException,
     UseGuards
    } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';


@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
        ){}
    //CookieExample
    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any) {
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session: any){
    //     return session.color;
    // }

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findOne(session.userId)
    // }

    @UseGuards(AuthGuard)
    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any){
        session.userId = null;
    }
        
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        console.log(`User created successfully with an email: ${body.email}`)
        const user = await this.authService.signUp(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signIn(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) { throw new NotFoundException(`User with id: ${id} not found !`)}
        return user;
    }

    @Get()
    findAllUUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
         return this.usersService.update(parseInt(id), body);
    }
}
