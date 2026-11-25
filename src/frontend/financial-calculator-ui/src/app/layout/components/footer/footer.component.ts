import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { ABOUT_ROUTE, GUIDE_ROUTE, VERIFY_ROUTE } from '@shared/constants/navigation.constant';
import { ClearDataButtonComponent } from '../clear-data-button/clear-data-button.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslocoDirective, ClearDataButtonComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  readonly guideRoute = GUIDE_ROUTE;
  readonly aboutRoute = ABOUT_ROUTE;
  readonly verifyRoute = VERIFY_ROUTE;
}
