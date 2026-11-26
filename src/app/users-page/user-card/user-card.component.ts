import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Output() readonly userDeleted = new EventEmitter<number>();
}
