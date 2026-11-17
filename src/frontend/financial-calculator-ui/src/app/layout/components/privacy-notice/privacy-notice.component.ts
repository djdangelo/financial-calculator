import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { readLocalStorage, writeLocalStorage } from '@core/functions/local-storage.function';
import {
  DIALOG_BREAKPOINTS,
  DIALOG_STYLE,
  PRIVACY_NOTICE_ACCEPTED_VALUE,
  PRIVACY_NOTICE_POINTS,
  PRIVACY_NOTICE_STORAGE_KEY
} from '../../constants/layout.constant';

@Component({
  selector: 'app-privacy-notice',
  standalone: true,
  imports: [TranslocoDirective, ButtonModule, DialogModule],
  templateUrl: './privacy-notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyNoticeComponent {
  readonly visible = signal(readLocalStorage(PRIVACY_NOTICE_STORAGE_KEY) !== PRIVACY_NOTICE_ACCEPTED_VALUE);
  readonly points = PRIVACY_NOTICE_POINTS;
  readonly dialogStyle = DIALOG_STYLE;
  readonly dialogBreakpoints = DIALOG_BREAKPOINTS;

  accept(): void {
    writeLocalStorage(PRIVACY_NOTICE_STORAGE_KEY, PRIVACY_NOTICE_ACCEPTED_VALUE);
    this.visible.set(false);
  }
}
