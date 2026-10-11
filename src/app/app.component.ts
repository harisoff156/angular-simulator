import './training'
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { Color } from '../enums/Color';
import { Collection } from '../collection';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, HeroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  numberCollection = new Collection<number>([10, 20, 30]);
  colorCollection = new Collection<Color>([Color.Red, Color.Green, Color.Blue]);

  constructor() {
    this.saveLastVisitDate();
    this.saveVisitCount();
  }

  private saveLastVisitDate(): void {
    localStorage.setItem('lastVisitDate', new Date().toISOString());
  }

  private saveVisitCount(): void {
    const savedCount = Number(localStorage.getItem('visitCount') ?? '0');
    localStorage.setItem('visitCount', String(savedCount + 1));
  }

  isPrimaryColor(color: Color): boolean {
    return color === Color.Red || color === Color.Green || color === Color.Blue;
  }
}


