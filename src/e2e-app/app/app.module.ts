import { NgModule, ApplicationRef, ApplicationInitStatus } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent, appRoutes, Home } from './app.component';
import { MdlModule } from 'angular2-mdl';
import { RouterModule } from '@angular/router';
import { PopoverDemo } from './popover/popover.component';
import { MdlPopoverModule } from '../../components/popover/popover';

@NgModule({
  imports: [
    BrowserModule,
    MdlModule,
    RouterModule.forRoot(appRoutes),
    MdlPopoverModule
  ],
  declarations: [
    AppComponent,
    Home,
    PopoverDemo
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
