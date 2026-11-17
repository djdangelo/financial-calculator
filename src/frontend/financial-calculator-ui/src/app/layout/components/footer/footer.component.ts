import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { ClearDataButtonComponent } from '../clear-data-button/clear-data-button.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslocoDirective, ClearDataButtonComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
