import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // Logbook page where users add/delete entries
  {
    path: 'logbook',
    loadComponent: () => import('./logbook/logbook.page').then(m => m.LogbookPage),
  },
];