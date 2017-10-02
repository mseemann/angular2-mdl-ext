import { NgModule, ApplicationRef, ApplicationInitStatus } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent, appRoutes, Home } from './app.component';
import { MdlModule } from '@angular-mdl/core';
import { RouterModule } from '@angular/router';
import { PopoverDemo } from './popover/popover.component';
import { SelectDemo } from './select/select.component';
import { MatchSorterPipe } from './select/matchSorter.pipe';
import { ExpansionPanelDemo } from './expansion-panel/expansion-panel.component';
import { MdlPopoverModule } from '../../components/popover/popover';
import { MdlSelectModule } from '../../components/select/select';
import { MdlFabMenuModule } from '../../components/fab-menu/fab-menu';
import { MdlExpansionPanelModule } from '../../components/expansion-panel/expansion-panel.component';
import { PrismDirective } from '@mseemann/prism';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatepickerDemo } from './datepicker/datepicker.component';
import { MdlDatePickerModule } from '../../components/datepicker/index';
import { FabMenuDemo } from './fab-menu/fab-menu-demo.component';
import { MdlVirtualTableModule} from "../../components/virtual-table/index"
import {VirtualTableDemo} from "./virtual-table/virtual-table.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MdlModule,
    RouterModule.forRoot(appRoutes),
    MdlPopoverModule,
    MdlSelectModule,
    MdlFabMenuModule,
    MdlExpansionPanelModule,
    BrowserAnimationsModule,
    MdlDatePickerModule,
    MdlVirtualTableModule
  ],
  declarations: [
    AppComponent,
    FabMenuDemo,
    Home,
    DatepickerDemo,
    PopoverDemo,
    SelectDemo,
    MatchSorterPipe,
    ExpansionPanelDemo,
    PrismDirective,
    VirtualTableDemo
  ],
  entryComponents: [AppComponent],
  bootstrap: []
})
export class AppModule {

  constructor(private appRef: ApplicationRef, private appStatus: ApplicationInitStatus) { }

  public ngDoBootstrap() {
    this.appStatus.donePromise.then( () => {
      let script = document.createElement('script');
      script.innerHTML = '';
      script.src = 'https://buttons.github.io/buttons.js';
      let anyScriptTag = document.getElementsByTagName('script')[0];
      anyScriptTag.parentNode.insertBefore(script, anyScriptTag);
    });
    this.appRef.bootstrap(AppComponent);
  }
}
