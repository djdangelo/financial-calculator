import { Routes } from '@angular/router';
import { LayoutComponent } from '@layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/home/pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/financial-profile/financial-profile.routes').then(m => m.financialProfileRoutes)
      },
      {
        path: '**',
        loadComponent: () => import('./shared/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  }
];
