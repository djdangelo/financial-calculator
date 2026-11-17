import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { WIZARD_HOME_ROUTE } from '@shared/constants/wizard.constant';

@Component({
  selector: 'app-wizard-navigation',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, ButtonModule],
  templateUrl: './wizard-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardNavigationComponent {
  readonly previousRoute = input<string | null>(null);
  readonly hasNext = input(true);
  readonly next = output<void>();

  readonly backRoute = computed(() => this.previousRoute() ?? WIZARD_HOME_ROUTE);
}
