import { Routes } from '@angular/router';
import { Login } from './login/login';

export const routes: Routes = [
    {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login)
    },

    {
    path: 'cadastro',
    loadComponent: () =>
      import('./cadastro/cadastro').then(m => m.Cadastro)
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];
