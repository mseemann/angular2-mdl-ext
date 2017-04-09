import { ModuleWithProviders, NgModule } from '@angular/core';
import { MdlDatePickerService } from './datepicker.service';
import { DatePickerDialogComponent } from './datepicker.component';
import { MdlButtonModule, MdlIconModule, MdlRippleModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MdlButtonModule,
    MdlIconModule,
    MdlRippleModule
  ],
  exports: [],
  declarations: [ DatePickerDialogComponent ],
  entryComponents: [DatePickerDialogComponent],
  providers: [ MdlDatePickerService ]
})
export class MdlDatePickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdlDatePickerModule,
      providers: []
    };
  }
}
