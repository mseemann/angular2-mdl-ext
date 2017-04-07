import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router, Routes
} from '@angular/router';
import '../css/style.scss';
import { PopoverDemo } from './popover/popover.component';
import { SelectDemo } from './select/select.component';
import { ExpansionPanelDemo } from './expansion-panel/expansion-panel.component';
import { MdlLayoutComponent } from '@angular-mdl/core';
import { DatepickerDemo } from './datepicker/datepicker.component';


@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class Home {
}


export const appRoutes: Routes = [
  { path: '', component: Home, data: {title: 'Home'} },
  { path: 'datepicker', component: DatepickerDemo, data: {title: 'Date Picker'} },
  { path: 'popover', component: PopoverDemo, data: {title: 'Popover'} },
  { path: 'select', component: SelectDemo, data: {title: 'Select'} },
  { path: 'expansion-panel', component: ExpansionPanelDemo, data: {title: 'Expanion Panel'} },
  { path: '**', redirectTo: '' }
];

@Component({
  selector: 'root-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title = 'Angular 2 - Material Design Lite Extensions';

  public componentSelected(mainLayout: MdlLayoutComponent) {
    mainLayout.closeDrawerOnSmallScreens();
  }

}
