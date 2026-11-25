import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly usersUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private readonly http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }
}
