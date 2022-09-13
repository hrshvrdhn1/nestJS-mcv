import { 
    UseInterceptors, 
    NestInterceptor, 
    ExecutionContext, 
    CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassContructor  {
    new (...args: any[]): {}
}


//Creating our own customised declarator. 
export function Serialize(dto: ClassContructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any){}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any>  {
        
        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true // This statement ensures that whenever we have the instance of UserDto and try to
                })                               // turn it into plain JSON, they are specifically marked @Expose inside of UserDto.
            } )
        )
    }
}