import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router, Routes
} from '@angular/router';
import '../css/style.scss';
import { PopoverDemo } from './popover/popover.component';
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
  { path: '**', redirectTo: '' }
];

@Component({
  moduleId: module.id,
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
