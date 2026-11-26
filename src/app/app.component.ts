import './training';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MessageComponent } from './message/message.component';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './services/loader.service';
import { Color } from '../enums/Color';
import { Collection } from '../collection';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, HeaderComponent, FooterComponent, MessageComponent, LoaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly numberCollection = new Collection<number>([10, 20, 30]);
  public readonly colorCollection = new Collection<Color>([Color.Red, Color.Green, Color.Blue]);

  constructor(
    private readonly storage: StorageService,
    protected readonly loaderService: LoaderService,
    iconLibrary: FaIconLibrary,
    // Создаём сервис при старте, чтобы сохранённая тема применилась сразу.
    private readonly themeService: ThemeService,
  ) {
    iconLibrary.addIconPacks(fas, far, fab);
    this.saveLastVisitDate();
    this.saveVisitCount();
  }

  public isPrimaryColor(color: Color): boolean {
    return color === Color.Red || color === Color.Green || color === Color.Blue;
  }

  private saveLastVisitDate(): void {
    this.storage.setItem('lastVisitDate', new Date().toISOString());
  }

  private saveVisitCount(): void {
    const savedCount = Number(this.storage.getItem<number>('visitCount') ?? 0);
    this.storage.setItem('visitCount', (Number.isFinite(savedCount) ? savedCount : 0) + 1);
  }
}


