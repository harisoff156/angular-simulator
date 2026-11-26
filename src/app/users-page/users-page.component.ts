import { AsyncPipe } from '@angular/common';
import { afterNextRender, Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { UserCardComponent } from './user-card/user-card.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UsersFilterComponent } from './users-filter/users-filter.component';

@Component({
  selector: 'app-users-page',
  imports: [AsyncPipe, UserCardComponent, UserCreateComponent, UsersFilterComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersComponent {
  private readonly nameFilter = new BehaviorSubject('');
  protected readonly filteredUsers$: Observable<User[]>;
  protected readonly hasLoaded = signal(false);

  constructor(private readonly userService: UserService, destroyRef: DestroyRef) {
    this.filteredUsers$ = combineLatest([userService.getUsers(), this.nameFilter]).pipe(
      map(([users, name]) => users.filter((user) => user.name.trim().toLowerCase().includes(name))),
    );

    afterNextRender(() => {
      userService.loadUsers().pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
        this.hasLoaded.set(true);
      });
    });
  }

  protected addUser(user: User): void {
    this.userService.addUser(user);
  }

  protected removeUser(id: number): void {
    this.userService.removeUser(id);
  }

  protected setNameFilter(name: string): void {
    this.nameFilter.next(name);
  }
}
