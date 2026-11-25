import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message',
  imports: [AsyncPipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  constructor(protected readonly messageService: MessageService) {}
}
