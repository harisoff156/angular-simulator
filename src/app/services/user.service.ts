import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, defer, finalize, Observable, of, tap } from 'rxjs';
import { User } from '../models/user';
import { LoaderService } from './loader.service';
import { MessageService } from './message.service';
import { StorageService as LocalStorageService } from './storage.service';
import { UserApiService } from './user-api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly storageKey = 'users';
  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  private readonly users$ = this.usersSubject.asObservable();

  constructor(
    private readonly userApi: UserApiService,
    private readonly loaderService: LoaderService,
    private readonly messageService: MessageService,
    private readonly storage: LocalStorageService,
  ) {}

  public setUsers(users: User[]): void {
    this.storage.setItem(this.storageKey, users);
    this.usersSubject.next(users);
  }

  public getUsers(): Observable<User[]> {
    return this.users$;
  }

  public addUser(user: User): void {
    const users = this.usersSubject.value;
    let id = user.id;
    while (users.some((existingUser) => existingUser.id === id)) {
      id++;
    }
    this.setUsers([...users, { ...user, id }]);
  }

  public removeUser(id: number): void {
    this.setUsers(this.usersSubject.value.filter((user) => user.id !== id));
  }

  public loadUsers(): Observable<User[]> {
    return defer(() => {
      const savedUsers = this.storage.getItem<User[]>(this.storageKey);
      if (Array.isArray(savedUsers)) {
        this.usersSubject.next(savedUsers);
        return of(savedUsers);
      }

      this.loaderService.showLoader();
      return this.userApi.getUsers().pipe(
        tap((users) => this.setUsers(users)),
        catchError(() => {
          this.messageService.showError('Не удалось загрузить пользователей');
          return of(this.usersSubject.value);
        }),
        finalize(() => this.loaderService.hideLoader()),
      );
    });
  }
}
