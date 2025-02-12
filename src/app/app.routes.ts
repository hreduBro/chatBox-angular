import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('../landing/landing.module').then(m => m.LandingModule) },
];
