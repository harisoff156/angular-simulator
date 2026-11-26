import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SelectButton } from 'primeng/selectbutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { map, Observable } from 'rxjs';
import { ColorMode, ThemeName, ThemeService } from '../services/theme.service';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, FormsModule, FaIconComponent, SelectButton, ToggleSwitch],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  protected readonly links = [
    { label: 'Главная', path: '/' },
    { label: 'Пользователи', path: '/users' },
  ];
  protected readonly activeLinkOptions: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  };

  protected readonly companyName = 'РУМТИБЕТ';
  protected currentDate = new Date().toLocaleString('ru-RU');
  protected clickCount = 0;
  protected isTimerVisible = true;

  protected readonly themeOptions: { label: string; value: ThemeName }[] = [
    { label: 'Aura', value: 'aura' },
    { label: 'Lara', value: 'lara' },
    { label: 'Nora', value: 'nora' },
  ];
  protected readonly theme$: Observable<ThemeName>;
  protected readonly isDark$: Observable<boolean>;

  private timerId: number | undefined;

  constructor(private readonly themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
    this.isDark$ = this.themeService.mode$.pipe(map((mode) => mode === 'dark'));
  }

  public ngOnInit(): void {
    this.timerId = window.setInterval(() => {
      this.currentDate = new Date().toLocaleString('ru-RU');
    }, 1000);
  }

  public ngOnDestroy(): void {
    window.clearInterval(this.timerId);
  }

  protected increaseCount(): void {
    this.clickCount += 1;
  }

  protected decreaseCount(): void {
    if (this.clickCount > 0) {
      this.clickCount -= 1;
    }
  }

  protected changeTheme(theme: ThemeName | null): void {
    // SelectButton отдаёт null при повторном клике по выбранной теме — игнорируем.
    if (theme) {
      this.themeService.setTheme(theme);
    }
  }

  protected changeMode(isDark: boolean): void {
    const mode: ColorMode = isDark ? 'dark' : 'light';
    this.themeService.setMode(mode);
  }

  protected toggleWidget(): void {
    this.isTimerVisible = !this.isTimerVisible;
  }
}
