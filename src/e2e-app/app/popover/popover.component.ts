import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'popover-demo',
  templateUrl: 'popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverDemo {}
