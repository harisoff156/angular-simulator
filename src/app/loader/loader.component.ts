import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  imports: [AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  constructor(protected readonly loaderService: LoaderService) {}
}
