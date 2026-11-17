import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { EntryOption } from '../../interfaces/entry-option.interface';

@Component({
  selector: 'app-add-entry-options',
  standalone: true,
  imports: [TranslocoDirective],
  templateUrl: './add-entry-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEntryOptionsComponent<T extends string> {
  readonly title = input.required<string>();
  readonly labelKey = input.required<string>();
  readonly options = input.required<readonly EntryOption<T>[]>();
  readonly selected = output<T>();
}
