import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { HOME_STEPS } from '../../constants/home.constant';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslocoDirective],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly steps = HOME_STEPS;
}
