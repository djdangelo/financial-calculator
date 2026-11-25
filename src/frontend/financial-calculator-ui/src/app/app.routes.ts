import { Routes } from '@angular/router';
import { loanStepGuard } from './features/loan-offers/guards/loan-step.guard';
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
        path: 'offer',
        canActivate: [loanStepGuard('offer')],
        loadComponent: () =>
          import('./features/loan-offers/pages/offer-step/offer-step.component').then(m => m.OfferStepComponent)
      },
      {
        path: 'result',
        canActivate: [loanStepGuard('result')],
        loadComponent: () =>
          import('./features/loan-analysis/pages/result-step/result-step.component').then(m => m.ResultStepComponent)
      },
      {
        path: 'verify',
        loadComponent: () =>
          import('./features/offer-verification/pages/verify/verify.component').then(m => m.VerifyComponent)
      },
      {
        path: 'guide',
        loadComponent: () => import('./features/guide/pages/guide/guide.component').then(m => m.GuideComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/pages/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: '**',
        loadComponent: () => import('./shared/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  }
];
