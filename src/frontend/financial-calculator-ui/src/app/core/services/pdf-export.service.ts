import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { PDF_ERROR_DETAIL_KEY, PDF_ERROR_SUMMARY_KEY } from '@core/constants/pdf.constant';
import { deliverPdfFile } from '@core/functions/pdf-delivery.function';
import { renderPdfReport } from '@core/functions/pdf-document.function';
import { PdfLibraries } from '@core/interfaces/pdf-libraries.interface';
import { PdfReport } from '@core/interfaces/pdf-report.interface';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);
  private libraries?: Promise<PdfLibraries>;

  readonly isExporting = signal(false);

  preload(): void {
    this.loadLibraries().catch(() => this.forgetLibraries());
  }

  async export(report: PdfReport): Promise<void> {
    if (this.isExporting()) {
      return;
    }
    this.isExporting.set(true);
    try {
      const blob = renderPdfReport(await this.loadLibraries(), report);
      await deliverPdfFile(blob, report.fileName);
    } catch {
      this.forgetLibraries();
      this.notifyError();
    } finally {
      this.isExporting.set(false);
    }
  }

  private loadLibraries(): Promise<PdfLibraries> {
    this.libraries ??= Promise.all([import('jspdf'), import('jspdf-autotable'), import('chart.js/auto')]).then(
      ([pdf, table, chart]) => ({ jsPDF: pdf.jsPDF, autoTable: table.autoTable, Chart: chart.Chart })
    );
    return this.libraries;
  }

  private forgetLibraries(): void {
    this.libraries = undefined;
  }

  private notifyError(): void {
    this.messageService.add({
      severity: 'error',
      summary: this.transloco.translate(PDF_ERROR_SUMMARY_KEY),
      detail: this.transloco.translate(PDF_ERROR_DETAIL_KEY)
    });
  }
}
