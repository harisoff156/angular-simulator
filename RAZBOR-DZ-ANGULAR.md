# Разбор домашнего задания

Это копия кода компонентов на момент выполнения задания с пояснениями между блоками. Рабочие файлы остаются в src/app; редактировать нужно именно их.

## Как устроено приложение

src/main.ts запускает AppComponent. Главный компонент размещает Navbar, Hero, AboutHike и Programs. Каждый компонент состоит из TypeScript (данные и поведение), HTML (шаблон) и SCSS (внешний вид). Так каждый блок отвечает за свою часть страницы.

В классе сначала расположены свойства, затем конструктор и методы жизненного цикла, затем остальные методы. protected доступны шаблону и наследникам; private предназначены для внутренней работы класса; public используют методы жизненного цикла и открытые методы. readonly запрещает повторное присваивание свойства.

## Главный компонент: загрузка и структура страницы

AppComponent управляет состоянием загрузки. Сначала isLoading равно true, поэтому @if показывает индикатор. В ngOnInit setTimeout через 2000 миллисекунд меняет значение на false, и Angular показывает компоненты страницы. ngOnDestroy отменяет таймер, если компонент удалён раньше. В этом же компоненте уже есть код предыдущих заданий: коллекции и сохранение данных в localStorage.

### src/app/app.component.ts

```typescript
import './training';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { AboutHikeComponent } from './about-hike/about-hike.component';
import { ProgramsComponent } from './programs/programs.component';
import { Color } from '../enums/Color';
import { Collection } from '../collection';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, HeroComponent, AboutHikeComponent, ProgramsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly numberCollection = new Collection<number>([10, 20, 30]);
  public readonly colorCollection = new Collection<Color>([Color.Red, Color.Green, Color.Blue]);

  protected isLoading = true;

  private loadingTimeoutId: number | undefined;

  constructor() {
    this.saveLastVisitDate();
    this.saveVisitCount();
  }

  public ngOnInit(): void {
    this.loadingTimeoutId = window.setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  public ngOnDestroy(): void {
    window.clearTimeout(this.loadingTimeoutId);
  }

  public isPrimaryColor(color: Color): boolean {
    return color === Color.Red || color === Color.Green || color === Color.Blue;
  }

  private saveLastVisitDate(): void {
    localStorage.setItem('lastVisitDate', new Date().toISOString());
  }

  private saveVisitCount(): void {
    const savedCount = Number(localStorage.getItem('visitCount') ?? '0');
    localStorage.setItem('visitCount', String(savedCount + 1));
  }
}
```

### src/app/app.component.html

```html
@if (isLoading) {
  <div class="page-loader" role="status" aria-label="Загрузка страницы">
    <svg
      class="page-loader__spinner"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11a9 9 0 0 1 15.36-6.36L21 7" />
      <path d="M21 3v4h-4" />
      <path d="M21 13a9 9 0 0 1-15.36 6.36L3 17" />
      <path d="M3 21v-4h4" />
    </svg>
    <span>Загрузка...</span>
  </div>
} @else {
  <app-navbar />
  <app-hero />
  <app-about-hike />
  <app-programs />
  <router-outlet />
}
```

### src/app/app.component.scss

```scss
.page-loader {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 16px;
  background: #fdfdfd;
  color: #1a3e3e;
}

.page-loader__spinner {
  width: 56px;
  height: 56px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-loader__spinner {
    animation: none;
  }
}
```

## Шапка: дата, счётчик и переключение

NavbarComponent хранит дату, число кликов и состояние переключателя. setInterval раз в секунду обновляет дату; ngOnDestroy останавливает интервал. Кнопки вызывают методы через (click). Минус отключён при нуле через [disabled], а метод дополнительно проверяет число. @if выбирает дату или счётчик, а выражение с ? меняет надпись кнопки.

### src/app/navbar/navbar.component.ts

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  protected readonly companyName = 'РУМТИБЕТ';
  protected currentDate = new Date().toLocaleString('ru-RU');
  protected clickCount = 0;
  protected isTimerVisible = true;

  private timerId: number | undefined;

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

  protected toggleWidget(): void {
    this.isTimerVisible = !this.isTimerVisible;
  }
}
```

### src/app/navbar/navbar.component.html

```html
<header class="navbar">
  <nav class="navbar__inner" aria-label="Главная навигация">
    <a class="navbar__logo" href="#">
      <img class="navbar__logo-icon" src="/icons/logo.svg" alt="" width="137" height="48" />
      <span class="navbar__logo-text">{{ companyName }}</span>
    </a>

    <ul class="navbar__links">
      <li><a href="#">Главная</a></li>
      <li><a href="#about">Про гида</a></li>
      <li><a href="#programs">Программа тура</a></li>
      <li><a href="#programs">Стоимость</a></li>
      <li><a href="#">Блог</a></li>
      <li><a href="#">Контакты</a></li>
    </ul>

    <a class="navbar__button" href="#">Консультация</a>
  </nav>

  <div class="navbar__widgets">
    <div class="navbar__widget">
      @if (isTimerVisible) {
        <p class="navbar__date">{{ currentDate }}</p>
      } @else {
        <div class="navbar__counter" aria-label="Счётчик кликов">
          <button type="button" (click)="increaseCount()" aria-label="Увеличить счётчик">
            +
          </button>
          <output aria-live="polite">{{ clickCount }}</output>
          <button
            type="button"
            (click)="decreaseCount()"
            [disabled]="clickCount === 0"
            aria-label="Уменьшить счётчик"
          >
            −
          </button>
        </div>
      }
    </div>

    <button class="navbar__toggle" type="button" (click)="toggleWidget()">
      {{ isTimerVisible ? 'Показать кликер' : 'Показать дату' }}
    </button>
  </div>
</header>
```

### src/app/navbar/navbar.component.scss

```scss
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  background: rgba(37, 47, 55, 0.72);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  max-width: 1180px;
  min-height: 104px;
  margin: 0 auto;
}

.navbar__logo {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #fdfdfd;
  text-decoration: none;
}

.navbar__logo-icon {
  display: block;
  width: 137px;
  height: 48px;
}

.navbar__logo-text {
  font-family: 'Next Art', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 6px;
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navbar__links a {
  color: #fdfdfd;
  font-size: 18px;
  font-weight: 600;
  line-height: 25px;
  text-decoration: none;
  white-space: nowrap;
}

.navbar__links a:hover {
  color: #f2be22;
}

.navbar__button {
  padding: 12px 24px;
  border-radius: 4px;
  background: #fdfdfd;
  color: #1a3e3e;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  text-decoration: none;
  white-space: nowrap;
}

.navbar__widgets {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 24px;
  max-width: 1180px;
  margin: 0 auto;
  padding-bottom: 12px;
  color: #fdfdfd;
}

.navbar__widget {
  flex: 0 0 200px;
}

.navbar__date {
  margin: 0;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.navbar__widgets button {
  padding: 10px 16px;
  border: 0;
  border-radius: 4px;
  background: #fdfdfd;
  color: #1a3e3e;
  font: inherit;
  line-height: 20px;
  cursor: pointer;
}

.navbar__widgets button:hover:not(:disabled) {
  background: #f2be22;
}

.navbar__widgets button:disabled {
  background: #657676;
  color: #d9dede;
  cursor: not-allowed;
}

.navbar__counter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.navbar__counter button {
  padding: 4px 8px;
  background: transparent;
  color: #fdfdfd;
}

.navbar__counter button:disabled {
  background: transparent;
  color: #8e9f9f;
}

.navbar__counter output {
  min-width: 32px;
  text-align: center;
}

.navbar__toggle {
  min-width: 158px;
}

@media (max-width: 1228px) {
  .navbar__widgets {
    margin-right: 24px;
    margin-left: 24px;
  }

  .navbar__inner {
    margin: 0 24px;
    gap: 24px;
  }

  .navbar__links {
    gap: 16px;
  }

  .navbar__links a {
    font-size: 16px;
  }
}

@media (max-width: 900px) {
  .navbar__widgets {
    gap: 12px;
    margin-right: 16px;
    margin-left: 16px;
  }

  .navbar__inner {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    margin: 0 16px;
    padding: 16px 0;
  }

  .navbar__links {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px 16px;
  }

  .navbar__logo-icon {
    width: 100px;
    height: 35px;
  }

  .navbar__logo-text {
    font-size: 12px;
    letter-spacing: 4px;
  }
}

@media (max-width: 600px) {
  .navbar__widget {
    flex: 1;
    min-width: 0;
  }

  .navbar__widgets {
    justify-content: space-between;
  }
}
```

## Первый экран: форма и live-input

FormsModule подключает ngModel. Запись [(ngModel)] связывает поле и свойство в двух направлениях: ввод меняет свойство, изменение свойства отражается в поле. [disabled] отключает кнопку, когда хотя бы одна строка пуста. liveText сразу выводится рядом через {{ liveText }}. Здесь нет отправки формы: задание требует только состояние кнопки.

### src/app/hero/hero.component.ts

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected location = '';
  protected hikeDate = '';
  protected participants = '';
  protected liveText = '';
}
```

### src/app/hero/hero.component.html

```html
<main class="hero">
  <div class="hero__content">
    <h1 class="hero__title">
      Насладись прогулкой в горах<br />
      с командой единомышленников
    </h1>

    <div class="hero__search">
      <label class="hero__field">
        <select aria-label="Локация для тура" [(ngModel)]="location" required>
          <option value="">Локация для тура</option>
          <option value="эльбрус">Эльбрус</option>
          <option value="алтай">Алтай</option>
          <option value="камчатка">Камчатка</option>
          <option value="байкал">Байкал</option>
        </select>
        <span>выберите из списка</span>
      </label>

      <label class="hero__field">
        <div class="hero__date">
          <input type="date" aria-label="Дата похода" [(ngModel)]="hikeDate" required />
          <span class="hero__date-label">Дата похода</span>
        </div>
        <span>укажите дату</span>
      </label>

      <label class="hero__field">
        <select aria-label="Количество участников" [(ngModel)]="participants" required>
          <option value="">Участники</option>
          <option value="1-2">1–2 человека</option>
          <option value="3-5">3–5 человек</option>
          <option value="6-10">6–10 человек</option>
          <option value="10+">Более 10</option>
        </select>
        <span>выберите из списка</span>
      </label>

      <button
        class="hero__search-button"
        type="button"
        [disabled]="!location || !hikeDate || !participants"
      >
        Найти программу
      </button>
    </div>

    <div class="hero__live">
      <input type="text" aria-label="Live-input" placeholder="Введите текст" [(ngModel)]="liveText" />
      <span class="hero__live-result">{{ liveText }}</span>
    </div>
  </div>
</main>
```

### src/app/hero/hero.component.scss

```scss
.hero {
  display: flex;
  align-items: flex-end;
  min-height: 985px;
  padding: 180px 24px 16px;
  background: url('/images/hero.png') center / cover;
  color: #fdfdfd;
}

.hero__content {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.hero__title {
  margin: 0 0 41px;
  font-size: 50px;
  font-weight: 400;
  line-height: 75px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hero__search {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 40px 42px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
}

.hero__field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.hero__field select,
.hero__field input {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid #e1e3e4;
  border-radius: 8px;
  background: transparent;
  color: #fdfdfd;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
}

.hero__field select option {
  background: #1a3e3e;
  color: #fdfdfd;
}

.hero__field > span {
  padding-left: 8px;
  font-size: 14px;
  line-height: 21px;
}

.hero__date {
  position: relative;
}

.hero__date input {
  color-scheme: dark;
}

.hero__date input:invalid::-webkit-datetime-edit {
  color: transparent;
}

.hero__date-label {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: 700;
  pointer-events: none;
}

.hero__date input:valid + .hero__date-label {
  display: none;
}

.hero__search-button {
  min-height: 52px;
  padding: 16px 36px;
  border: 0;
  border-radius: 4px;
  background: #1a3e3e;
  color: #fdfdfd;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 200ms ease, color 200ms ease;
}

.hero__search-button:hover:not(:disabled) {
  background: #fdfdfd;
  color: #1a3e3e;
}

.hero__search-button:disabled {
  background: #657676;
  color: #d9dede;
  cursor: not-allowed;
}

.hero__live {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 16px;
}

.hero__live input {
  flex-shrink: 0;
  width: 450px;
  height: 50px;
  padding: 0 16px;
  border: 1px solid #e1e3e4;
  background: transparent;
  color: #fdfdfd;
  font: inherit;
}

.hero__live-result {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 1100px) {
  .hero__title {
    font-size: 40px;
    line-height: 60px;
  }

  .hero__search {
    gap: 16px;
    padding: 28px;
  }

  .hero__search-button {
    padding-right: 20px;
    padding-left: 20px;
  }
}

@media (max-width: 760px) {
  .hero {
    min-height: 800px;
    padding: 280px 16px 24px;
  }

  .hero__title {
    margin-bottom: 32px;
    font-size: 28px;
    line-height: 42px;
    overflow-wrap: anywhere;
  }

  .hero__title br {
    display: none;
  }

  .hero__search {
    flex-direction: column;
    padding: 20px;
  }

  .hero__field,
  .hero__search-button {
    width: 100%;
  }

  .hero__live {
    flex-wrap: wrap;
    gap: 12px;
  }

  .hero__live input {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__search-button {
    transition: none;
  }
}
```

## О нашем походе

Этот компонент отвечает за отдельную секцию. HTML задаёт содержание, SCSS — расположение, размеры и наведение. Изображения лежат в public/images; пути начинаются с /images. При наведении фотографии плавно увеличиваются.

### src/app/about-hike/about-hike.component.ts

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-hike',
  imports: [],
  templateUrl: './about-hike.component.html',
  styleUrl: './about-hike.component.scss',
})
export class AboutHikeComponent {}
```

### src/app/about-hike/about-hike.component.html

```html
<section class="about" id="about">
  <div class="about__inner">
    <div class="about__photos">
      <img class="about__mountain" src="/images/about-mountain.png" alt="Горная вершина в облаках" width="350" height="400" />
      <div class="about__video">
        <img class="about__cabin" src="/images/about-cabin.png" alt="Домик в горной долине" width="350" height="400" />
        <img class="about__play" src="/icons/play.png" alt="" width="50" height="50" />
      </div>
    </div>

    <div class="about__content">
      <p class="about__eyebrow">о нашем походе</p>
      <h2 class="about__title">Исследуйте все горные массивы мира вместе с нами</h2>
      <p class="about__text">
        Его корни уходят в один фрагмент классической латыни 45 года н.э., то есть более двух
        тысячелетий назад. Ричард МакКлинток, профессор латыни из колледжа Hampden-Sydney, штат
        Вирджиния, взял одно из самых странных слов в Lorem Ipsum, "consectetur" и занялся его
        поисками в классической латинской литературе.
      </p>
      <a class="about__button" href="#programs">Программа тура</a>
    </div>
  </div>
</section>
```

### src/app/about-hike/about-hike.component.scss

```scss
.about {
  padding: 100px 24px;
  background: #fff;
}

.about__inner {
  display: grid;
  grid-template-columns: 480px 1fr;
  align-items: center;
  gap: 120px;
  max-width: 1180px;
  margin: 0 auto;
}

.about__photos {
  position: relative;
  height: 526px;
}

.about__mountain,
.about__cabin {
  display: block;
  width: 350px;
  height: 400px;
  border-radius: 24px;
  object-fit: cover;
  transition: transform 200ms ease;
}

.about__mountain:hover,
.about__video:hover .about__cabin {
  transform: scale(1.02);
}

.about__video {
  position: absolute;
  right: 0;
  bottom: 0;
}

.about__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.about__eyebrow {
  margin: 0 0 8px;
  color: #f2be22;
  font-size: 24px;
  line-height: 20px;
}

.about__title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

.about__text {
  margin: 40px 0;
  font-size: 18px;
  line-height: 27px;
}

.about__button {
  display: inline-block;
  vertical-align: top;
  padding: 16px 36px;
  box-shadow: inset 0 0 0 1px #1a3e3e;
  border-radius: 4px;
  background: #1a3e3e;
  color: #fdfdfd;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.2px;
  text-decoration: none;
  transition: background-color 200ms ease, color 200ms ease;
}

.about__button:hover {
  background: #fff;
  color: #1a3e3e;
}

@media (max-width: 1100px) {
  .about__inner {
    grid-template-columns: 420px 1fr;
    gap: 40px;
  }
}

@media (max-width: 800px) {
  .about {
    padding: 60px 16px;
  }

  .about__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .about__photos {
    width: min(480px, 100%);
    height: auto;
    aspect-ratio: 480 / 526;
    margin: 0 auto;
  }

  .about__mountain,
  .about__video {
    width: 73%;
  }

  .about__mountain,
  .about__cabin {
    height: auto;
  }

  .about__cabin {
    width: 100%;
  }

  .about__eyebrow {
    font-size: 20px;
  }

  .about__title {
    font-size: 26px;
  }

  .about__text {
    margin: 24px 0;
    font-size: 16px;
    line-height: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about__mountain,
  .about__cabin,
  .about__button {
    transition: none;
  }
}
```

## Лучшие программы

Массив advantages содержит данные каждого преимущества. @for перебирает массив и создаёт li для каждого объекта; track advantage.id помогает Angular узнавать элементы. Интерполяция {{ ... }} выводит текст, а [src] передаёт путь изображения. Стили задают сетку, адаптивность и анимацию наведения.

### src/app/programs/programs.component.ts

```typescript
import { Component } from '@angular/core';

interface Advantage {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-programs',
  imports: [],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
})
export class ProgramsComponent {
  protected readonly advantages: Advantage[] = [
    {
      id: 1,
      title: 'Опытный гид',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      icon: '/icons/guide.svg',
    },
    {
      id: 2,
      title: 'Безопасный поход',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      icon: '/icons/safety.svg',
    },
    {
      id: 3,
      title: 'Лояльные цены',
      description: 'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
      icon: '/icons/price.svg',
    },
  ];
}
```

### src/app/programs/programs.component.html

```html
<section class="programs" id="programs">
  <div class="programs__inner">
    <div class="programs__content">
      <p class="programs__eyebrow">наше предложение</p>
      <h2 class="programs__title">Лучшие программы для тебя</h2>
      <p class="programs__description">
        Его корни уходят в один фрагмент классической латыни 45 года н.э., то есть более двух
        тысячелетий назад. Ричард МакКлинток, профессор латыни из колледжа.
      </p>

      <ul class="programs__advantages">
        @for (advantage of advantages; track advantage.id) {
          <li class="programs__advantage">
            <img [src]="advantage.icon" alt="" width="50" height="50" />
            <div>
              <h3>{{ advantage.title }}</h3>
              <p>{{ advantage.description }}</p>
            </div>
          </li>
        }
      </ul>

      <a class="programs__button" href="#programs">Стоимость программ</a>
    </div>

    <div class="programs__photos">
      <img src="/images/program-tea.png" alt="Чашка чая на фоне бирюзового горного озера" width="250" height="250" />
      <img src="/images/program-hiker.png" alt="Путешественник с рюкзаком в горах" width="250" height="250" />
      <img src="/images/program-snow.png" alt="Отдых на вершине среди заснеженных гор" width="250" height="250" />
      <img src="/images/program-valley.png" alt="Река и цветная горная долина" width="250" height="250" />
    </div>
  </div>
</section>
```

### src/app/programs/programs.component.scss

```scss
.programs {
  padding: 80px 24px 100px;
  background: #f3f5f4;
}

.programs__inner {
  display: grid;
  grid-template-columns: 580px 1fr;
  align-items: center;
  gap: 90px;
  max-width: 1180px;
  margin: 0 auto;
}

.programs__eyebrow {
  margin: 0 0 8px;
  color: #f2be22;
  font-size: 24px;
  line-height: 20px;
}

.programs__title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

.programs__description {
  margin: 40px 0;
  font-size: 18px;
  line-height: 27px;
}

.programs__advantages {
  display: grid;
  gap: 40px;
  margin: 0 0 40px;
  padding: 0;
  list-style: none;
}

.programs__advantage {
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 200ms ease;
}

.programs__advantage:hover {
  transform: translateX(6px);
}

.programs__advantage img {
  flex-shrink: 0;
}

.programs__advantage h3 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0.2px;
}

.programs__advantage p {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

.programs__button {
  display: inline-block;
  vertical-align: top;
  padding: 16px 36px;
  box-shadow: inset 0 0 0 1px #1a3e3e;
  border-radius: 4px;
  background: #1a3e3e;
  color: #fdfdfd;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.2px;
  text-decoration: none;
  transition: background-color 200ms ease, color 200ms ease;
}

.programs__button:hover {
  background: #f3f5f4;
  color: #1a3e3e;
}

.programs__photos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.programs__photos img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0 50px;
  transition: transform 200ms ease;
}

.programs__photos img:nth-child(2),
.programs__photos img:nth-child(3) {
  border-radius: 50px 0;
}

.programs__photos img:hover {
  transform: scale(1.03);
}

@media (max-width: 1100px) {
  .programs__inner {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}

@media (max-width: 800px) {
  .programs {
    padding: 60px 16px;
  }

  .programs__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .programs__eyebrow {
    font-size: 20px;
  }

  .programs__title {
    font-size: 26px;
  }

  .programs__description {
    margin: 24px 0 32px;
    font-size: 16px;
    line-height: 24px;
  }

  .programs__advantages {
    gap: 32px;
    margin-bottom: 32px;
  }

  .programs__photos {
    width: min(510px, 100%);
    margin: 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .programs__advantage,
  .programs__photos img,
  .programs__button {
    transition: none;
  }
}
```

## Как применить эту схему в следующем проекте

1. Разделите страницу на понятные блоки и создайте для каждого компонент.
2. Данные и действия храните в TypeScript компонента; отображайте их в HTML через {{ }}, [свойство] и (событие).
3. Для редактируемого поля подключите FormsModule и используйте [(ngModel)].
4. Для повторяющихся элементов храните данные в массиве и выводите их через @for.
5. Для временных процессов запускайте таймер при создании компонента и очищайте его при удалении.
6. Стили и адаптивность размещайте в SCSS соответствующего компонента.
