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
import {FabMenuDemo} from './fab-menu/fab-menu-demo.component';
import {VirtualTableDemo} from "./virtual-table/virtual-table.component";


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
  { path: 'fab-menu', component: FabMenuDemo, data: {title: 'FAB Menu'} },
  { path: 'virtual-table', component: VirtualTableDemo, data: {title: 'Virtual Table'} },
  { path: '**', redirectTo: '' }
];

@Component({
  selector: 'root-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title = 'Angular - Material Design Lite Extensions';

  public componentSelected(mainLayout: MdlLayoutComponent) {
    mainLayout.closeDrawerOnSmallScreens();
  }

}
