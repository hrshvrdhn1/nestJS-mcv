import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";


// A test for Auth Service.
describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create fake copy of the usersService.
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter((user) => user.email === email );
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random()*9999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            }  
        }
        const module = await Test.createTestingModule ({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    })
    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined(); 
    })

    it('creates a new user with a salted and hashed password', async() => {
        const user = await service.signUp('asdf@asdf.com', 'asdf');
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it("throws an error if email is in use", async () => {
        await service.signUp('a@a.com', 'asdf');//<---Providing same Email for signUp simulating the condition where email is in use.
        await expect(service.signUp('a@a.com', 'asdf')).rejects.toThrow(BadRequestException);   
    });

    it('throws error if sign is called with an unused email', async() => { //<---Email that is never registered should be entered to simulate the condition of unused Email during signIn.
        await expect(service.signIn('b@b.z', 'asdf')).rejects.toThrowError(NotFoundException);
    })

    it('throws error if an invalid password is provided', async() => {
        await service.signUp('c@c.com', 'asdfg')//<----Passwords should be different to simulate condition of invalid passwrod.
        await expect(service.signIn('c@c.com', 'asdf')).rejects.toThrow(BadRequestException);
    })

    it('returns a user if correct password id provided', async() => {
        // Video 97
        await service.signUp('d@d.com', 'asdf');//<---Providing correct email and password to simulate the condition as described.
        const user = await service.signIn('d@d.com','asdf');
        expect(user).toBeDefined(); 
    });

    
});
