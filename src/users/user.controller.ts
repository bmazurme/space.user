import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';

import { UserByEmail, UserById } from './interfaces/user-by-id.interface';
import { User } from './interfaces/user.interface';

interface UsersService {
  findOne(data: UserById): Observable<User>;
  findByEmail(data: UserByEmail): Observable<User>;
  findMany(upstream: Observable<UserById>): Observable<User>;
}

@Controller('user')
export class UserController implements OnModuleInit {
  private readonly items: User[] = [
    { id: 1, email: 'e@e.com', name: 'uJohn123' },
    { id: 2, email: 'u@e.com', name: 'uDoe' },
  ];
  private usersService: UsersService;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UsersService');
  }

  @Get()
  getMany(): Observable<User[]> {
    const ids$ = new ReplaySubject<UserById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();

    const stream = this.usersService.findMany(ids$.asObservable());
    return stream.pipe(toArray());
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<User> {
    return this.usersService.findOne({ id: +id });
  }

  @Get('email/:email')
  getByEmail(@Param('email') email: string): Observable<User> {
    return this.usersService.findByEmail({ email });
  }

  @GrpcMethod('UsersService')
  findByEmail(data: UserByEmail): User {
    return this.items.find(({ email }) => email === data.email);
  }

  @GrpcMethod('UsersService')
  findOne(data: UserById): User {
    return this.items.find(({ id }) => id === data.id);
  }

  @GrpcStreamMethod('UsersService')
  findMany(data$: Observable<UserById>): Observable<User> {
    const user$ = new Subject<User>();

    const onNext = (userById: UserById) => {
      const item = this.items.find(({ id }) => id === userById.id);
      user$.next(item);
    };
    const onComplete = () => user$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return user$.asObservable();
  }
}
