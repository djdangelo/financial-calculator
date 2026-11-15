import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { AVAILABLE_LANGUAGES } from '@core/constants/language.constant';
import { LanguageService } from '@core/services/language.service';
import { LANGUAGE_BUTTON_CLASS } from '../../constants/layout.constant';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslocoDirective],
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcherComponent {
  readonly languageService = inject(LanguageService);
  readonly languages = AVAILABLE_LANGUAGES;
  readonly buttonClass = LANGUAGE_BUTTON_CLASS;
}
