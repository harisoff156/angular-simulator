import { Injectable } from '@angular/core';
import { usePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export type ThemeName = 'aura' | 'lara' | 'nora';
export type ColorMode = 'light' | 'dark';

const THEME_KEY = 'theme';
const MODE_KEY = 'colorMode';
const DEFAULT_THEME: ThemeName = 'aura';
const DEFAULT_MODE: ColorMode = 'light';
const DARK_CLASS = 'app-dark';

const PRESETS = { aura: Aura, lara: Lara, nora: Nora };

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Единый источник состояния: значения читаем из хранилища или берём по умолчанию.
  private readonly themeSubject: BehaviorSubject<ThemeName>;
  private readonly modeSubject: BehaviorSubject<ColorMode>;

  public readonly theme$: Observable<ThemeName>;
  public readonly mode$: Observable<ColorMode>;

  constructor(private readonly storage: StorageService) {
    this.themeSubject = new BehaviorSubject<ThemeName>(this.readTheme());
    this.modeSubject = new BehaviorSubject<ColorMode>(this.readMode());
    this.theme$ = this.themeSubject.asObservable();
    this.mode$ = this.modeSubject.asObservable();

    this.theme$.subscribe((theme) => {
      usePreset(PRESETS[theme]);
      this.storage.setItem(THEME_KEY, theme);
    });

    this.mode$.subscribe((mode) => {
      document.documentElement.classList.toggle(DARK_CLASS, mode === 'dark');
      this.storage.setItem(MODE_KEY, mode);
    });
  }

  public setTheme(theme: ThemeName): void {
    this.themeSubject.next(theme);
  }

  public setMode(mode: ColorMode): void {
    this.modeSubject.next(mode);
  }

  public toggleMode(): void {
    this.setMode(this.modeSubject.value === 'dark' ? 'light' : 'dark');
  }

  private readTheme(): ThemeName {
    const saved = this.storage.getItem<string>(THEME_KEY);
    return saved === 'aura' || saved === 'lara' || saved === 'nora' ? saved : DEFAULT_THEME;
  }

  private readMode(): ColorMode {
    const saved = this.storage.getItem<string>(MODE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : DEFAULT_MODE;
  }
}
