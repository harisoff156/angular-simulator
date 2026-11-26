import { Component, EventEmitter, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-users-filter',
  imports: [ReactiveFormsModule],
  template: `
    <label for="users-name-filter">Фильтр по имени</label>
    <input id="users-name-filter" type="search" [formControl]="nameFilter" />
  `,
  styles: `
    label {
      display: block;
      font-weight: 700;
    }

    input {
      box-sizing: border-box;
      width: min(100%, 320px);
      margin-top: 4px;
      padding: 8px 12px;
      border: 1px solid var(--p-primary-color);
      border-radius: 4px;
      background: var(--p-content-background);
      color: var(--p-text-color);
      font: inherit;
    }
  `,
})
export class UsersFilterComponent {
  @Output() readonly filterChanged = new EventEmitter<string>();
  protected readonly nameFilter = new FormControl('', { nonNullable: true });

  constructor() {
    this.nameFilter.valueChanges
      .pipe(
        map((name) => name.trim().toLowerCase()),
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((name) => this.filterChanged.emit(name));
  }
}
