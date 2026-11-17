import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserDataService } from '@core/services/user-data.service';
import { WIZARD_HOME_ROUTE } from '@shared/constants/wizard.constant';
import {
  CLEAR_DATA_ACCEPT_BUTTON,
  CLEAR_DATA_REJECT_BUTTON,
  CLEAR_DATA_TRANSLATION_SCOPE,
  DIALOG_BREAKPOINTS,
  DIALOG_STYLE
} from '../../constants/layout.constant';

@Component({
  selector: 'app-clear-data-button',
  standalone: true,
  imports: [TranslocoDirective, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './clear-data-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClearDataButtonComponent {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);
  private readonly userData = inject(UserDataService);
  private readonly router = inject(Router);

  readonly dialogStyle = DIALOG_STYLE;
  readonly dialogBreakpoints = DIALOG_BREAKPOINTS;

  confirm(): void {
    this.confirmationService.confirm({
      header: this.translate('header'),
      message: this.translate('message'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate('accept'),
      rejectLabel: this.translate('reject'),
      acceptButtonProps: CLEAR_DATA_ACCEPT_BUTTON,
      rejectButtonProps: CLEAR_DATA_REJECT_BUTTON,
      defaultFocus: 'reject',
      accept: () => this.clear()
    });
  }

  private async clear(): Promise<void> {
    try {
      await this.userData.clearAll();
      await this.router.navigateByUrl(WIZARD_HOME_ROUTE);
      this.notify('success', 'success_title', 'success');
    } catch {
      this.notify('error', 'error_title', 'error');
    }
  }

  private notify(severity: string, summaryKey: string, detailKey: string): void {
    this.messageService.add({ severity, summary: this.translate(summaryKey), detail: this.translate(detailKey) });
  }

  private translate(key: string): string {
    return this.transloco.translate(`${CLEAR_DATA_TRANSLATION_SCOPE}.${key}`);
  }
}
