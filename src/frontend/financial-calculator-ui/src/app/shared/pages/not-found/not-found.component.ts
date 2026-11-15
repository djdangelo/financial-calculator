import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, ButtonModule],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
