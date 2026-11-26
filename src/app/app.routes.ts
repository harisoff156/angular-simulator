import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { UsersComponent } from './users-page/users-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full', title: 'Главная · РумТибет' },
  { path: 'users', component: UsersComponent, title: 'Пользователи · РумТибет' },
  { path: '**', component: NotFoundPageComponent, title: 'Страница не найдена · РумТибет' },
];
