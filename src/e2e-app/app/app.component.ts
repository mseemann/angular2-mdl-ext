import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router, Routes
} from '@angular/router';
import '../css/style.scss';
import { PopoverDemo } from './popover/popover.component';
import { SelectDemo } from './select/select.component';
import { MdlLayoutComponent } from 'angular2-mdl';


@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class Home {
}


export const appRoutes: Routes = [
  { path: '', component: Home, data: {title: 'Home'} },
  { path: 'popover', component: PopoverDemo, data: {title: 'Popover'} },
  { path: 'select', component: SelectDemo, data: {title: 'Select'} },
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
