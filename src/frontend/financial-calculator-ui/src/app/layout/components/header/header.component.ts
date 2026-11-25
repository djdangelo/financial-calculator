import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { GUIDE_ROUTE, VERIFY_ROUTE } from '@shared/constants/navigation.constant';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, ButtonModule, LanguageSwitcherComponent, ThemeToggleComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly guideRoute = GUIDE_ROUTE;
  readonly verifyRoute = VERIFY_ROUTE;
}
