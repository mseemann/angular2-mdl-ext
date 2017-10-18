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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
     :host {
        flex-grow: 1;
     }
     .container {
        width:200px;
        height: 212px;
        position: relative;
        margin: auto;
     }
     .bar {
        box-sizing: border-box;
        width: 100%;
        padding: 16px;
        height: 64px;
     }
     .bar button {
        color: white;
     }
     .top-right{
        position:absolute;
        box-sizing: border-box;
        right: 16px;
     }
     .background {
        background: white;
        height: 148px;
        width: 100%;
     }
    `
  ]
})
export class PopoverDemo {
    onShow() {
      console.log('onShow');
    }

    onHide() {
        console.log('onHide');
    }
}
