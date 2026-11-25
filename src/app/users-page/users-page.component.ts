import { AsyncPipe } from '@angular/common';
import { afterNextRender, Component, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-page',
  imports: [AsyncPipe],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  protected readonly users$: Observable<User[]>;
  protected readonly hasLoaded = signal(false);

  constructor(userService: UserService, destroyRef: DestroyRef) {
    this.users$ = userService.getUsers();

    afterNextRender(() => {
      userService.loadUsers().pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
        this.hasLoaded.set(true);
      });
    });
  }
}
