import { NgModule, ApplicationRef, ApplicationInitStatus } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MdlModule } from 'angular2-mdl';

@NgModule({
  imports: [
    BrowserModule,
    MdlModule
  ],
  declarations: [
    AppComponent
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
