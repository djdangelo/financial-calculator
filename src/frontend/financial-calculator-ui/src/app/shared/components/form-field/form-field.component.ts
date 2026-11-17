import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [TranslocoDirective],
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly inputId = input<string | null>(null);
  readonly labelId = input<string | null>(null);
  readonly optional = input(false);
  readonly hint = input('');
  readonly error = input('');
}
