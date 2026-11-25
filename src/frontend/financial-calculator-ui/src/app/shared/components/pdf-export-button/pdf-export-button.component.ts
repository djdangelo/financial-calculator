import { ChangeDetectionStrategy, Component, OnInit, inject, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { PdfExportService } from '@core/services/pdf-export.service';

@Component({
  selector: 'app-pdf-export-button',
  standalone: true,
  imports: [TranslocoDirective, ButtonModule],
  templateUrl: './pdf-export-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfExportButtonComponent implements OnInit {
  private readonly pdf = inject(PdfExportService);

  readonly isExporting = this.pdf.isExporting;
  readonly requested = output<void>();

  ngOnInit(): void {
    this.pdf.preload();
  }
}
