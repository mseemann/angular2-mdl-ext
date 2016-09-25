import { NgModule, ApplicationRef, ApplicationInitStatus } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent, appRoutes, Home } from './app.component';
import { MdlModule } from 'angular2-mdl';
import { RouterModule } from '@angular/router';
import { PopoverDemo } from './popover/popover.component';
import { SelectDemo } from './select/select.component';
import { MdlPopoverModule } from '../../components/popover/popover';
import { MdlSelectModule } from '../../components/select/select';
import { PrismDirective } from '@mseemann/prism';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MdlModule,
    RouterModule.forRoot(appRoutes),
    MdlPopoverModule,
    MdlSelectModule
  ],
  declarations: [
    AppComponent,
    Home,
    PopoverDemo,
    SelectDemo,
    PrismDirective
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
