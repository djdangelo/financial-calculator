import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PWA_TOAST_KEY, PWA_TOAST_POSITION } from '@core/constants/pwa.constant';
import { PwaService } from '@core/services/pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoPipe, PrimeTemplate, ButtonModule, ToastModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly pwa = inject(PwaService);
  readonly pwaToastKey = PWA_TOAST_KEY;
  readonly pwaToastPosition = PWA_TOAST_POSITION;
}
