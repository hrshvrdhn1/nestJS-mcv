import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DBOptions } from 'db.datasourceoptions';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const dbOptions: TypeOrmModuleOptions = {
          // retryAttempts: 10,
          // retryDelay: 3000,
          // autoLoadEntities: false
        };

        Object.assign(dbOptions, DBOptions);

        return dbOptions;
      },
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       synchronize: true, //<--- TypeORM keeps the database table in sync with the entity we have provided when we keep this property true.
    //       entities: [User, Report]
    //     }
    //   }
    // }), 
  UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,//<--- Here we create a globally scoped validation pipe.
      useValue: new ValidationPipe({
        whitelist: true //<----- For security purpose so that user dont get the chance of adding extra properties in a request.
      }) 
    }
  ],
})

export class AppModule {
  constructor(private configService : ConfigService){}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.configService.get('COOKIE_KEY')]
    })
    ).forRoutes('*');
  }
}


