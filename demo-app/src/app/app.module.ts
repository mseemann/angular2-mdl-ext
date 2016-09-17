import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '../../../src/components/popover';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MdlModule,
    MdlPopoverModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
