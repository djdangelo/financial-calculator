import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { GUIDE_ROUTE } from '@shared/constants/navigation.constant';
import {
  APP_STACK,
  DEVELOPER_INITIALS,
  DEVELOPER_LINKS,
  DEVELOPER_NAME,
  DEVELOPER_STACK,
  EXTERNAL_LINK_REL,
  EXTERNAL_LINK_TARGET
} from '../../constants/about.constant';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, TranslocoDirective],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  readonly developerName = DEVELOPER_NAME;
  readonly developerInitials = DEVELOPER_INITIALS;
  readonly links = DEVELOPER_LINKS;
  readonly stack = DEVELOPER_STACK;
  readonly appStack = APP_STACK;
  readonly linkTarget = EXTERNAL_LINK_TARGET;
  readonly linkRel = EXTERNAL_LINK_REL;
  readonly guideRoute = GUIDE_ROUTE;
}
