import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, LanguageSwitcherComponent, ThemeToggleComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {}
