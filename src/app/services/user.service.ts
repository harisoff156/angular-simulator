import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, defer, finalize, Observable, of, tap } from 'rxjs';
import { User } from '../models/user';
import { LoaderService } from './loader.service';
import { MessageService } from './message.service';
import { UserApiService } from './user-api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  private readonly users$ = this.usersSubject.asObservable();

  constructor(
    private readonly userApi: UserApiService,
    private readonly loaderService: LoaderService,
    private readonly messageService: MessageService,
  ) {}

  public setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  public getUsers(): Observable<User[]> {
    return this.users$;
  }

  public loadUsers(): Observable<User[]> {
    return defer(() => {
      this.loaderService.showLoader();
      return this.userApi.getUsers();
    }).pipe(
      catchError(() => {
        this.messageService.showError('Не удалось загрузить пользователей');
        return of([]);
      }),
      tap((users) => this.setUsers(users)),
      finalize(() => this.loaderService.hideLoader()),
    );
  }
}
