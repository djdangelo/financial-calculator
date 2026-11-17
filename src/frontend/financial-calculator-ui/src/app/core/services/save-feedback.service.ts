import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { SAVE_ERROR_DETAIL_KEY, SAVE_ERROR_SUMMARY_KEY } from '@core/constants/feedback.constant';

@Injectable({ providedIn: 'root' })
export class SaveFeedbackService {
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  async track(save: Promise<unknown>): Promise<void> {
    try {
      await save;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.transloco.translate(SAVE_ERROR_SUMMARY_KEY),
        detail: this.transloco.translate(SAVE_ERROR_DETAIL_KEY)
      });
    }
  }
}
