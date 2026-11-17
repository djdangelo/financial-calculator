import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile-entry-card',
  standalone: true,
  imports: [TranslocoDirective, ButtonModule],
  templateUrl: './profile-entry-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileEntryCardComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly removed = output<void>();
}
