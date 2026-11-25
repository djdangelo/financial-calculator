import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { AFTER_PRINT_EVENT, BEFORE_PRINT_EVENT } from '@core/constants/print.constant';

@Injectable({ providedIn: 'root' })
export class PrintService {
  readonly isPrinting = signal(false);

  constructor() {
    const onBeforePrint = () => this.isPrinting.set(true);
    const onAfterPrint = () => this.isPrinting.set(false);
    window.addEventListener(BEFORE_PRINT_EVENT, onBeforePrint);
    window.addEventListener(AFTER_PRINT_EVENT, onAfterPrint);
    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener(BEFORE_PRINT_EVENT, onBeforePrint);
      window.removeEventListener(AFTER_PRINT_EVENT, onAfterPrint);
    });
  }
}
