import { AuthService } from './auth.service';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService 
    // { // I have commented this because now we have currentUserMiddleware in place of Interceptor.
    //   provide: APP_INTERCEPTOR,//<------// There we set a globally scoped 
    //   useClass: CurrentUserInterceptor // interceptor. This will work for
    // }                                 //  all request in our application.
  ]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
