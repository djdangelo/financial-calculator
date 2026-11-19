import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionEvent, VersionReadyEvent } from '@angular/service-worker';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { PWA_TOAST_KEY, VERSION_READY_EVENT } from '@core/constants/pwa.constant';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter((event: VersionEvent): event is VersionReadyEvent => event.type === VERSION_READY_EVENT),
        takeUntilDestroyed()
      )
      .subscribe(() => this.notifyUpdate());
  }

  reload(): void {
    document.location.reload();
  }

  private notifyUpdate(): void {
    this.messageService.add({
      key: PWA_TOAST_KEY,
      severity: 'info',
      summary: this.transloco.translate('layout.pwa.update_title'),
      detail: this.transloco.translate('layout.pwa.update_detail'),
      sticky: true
    });
  }
}
