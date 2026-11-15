import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '@core/services/theme.service';
import { THEME_TOGGLE_ICON, THEME_TOGGLE_LABEL_KEY } from '../../constants/layout.constant';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslocoDirective, ButtonModule],
  templateUrl: './theme-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly icon = computed(() => THEME_TOGGLE_ICON[this.themeService.colorScheme()]);
  readonly labelKey = computed(() => THEME_TOGGLE_LABEL_KEY[this.themeService.colorScheme()]);

  toggle(): void {
    this.themeService.toggle();
  }
}
