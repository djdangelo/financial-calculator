import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { WIZARD_START_ROUTE } from '@shared/constants/wizard.constant';
import { HOME_STEPS } from '../../constants/home.constant';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, ButtonModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly steps = HOME_STEPS;
  readonly startRoute = WIZARD_START_ROUTE;
}
