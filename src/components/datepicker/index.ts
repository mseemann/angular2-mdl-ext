import { NgModule } from '@angular/core';
import { MdlDatePickerService } from './datepicker.service';
import { DatePickerDialogComponent } from './datepicker.component';
import { MdlButtonModule, MdlDialogModule, MdlDialogService, MdlIconModule, MdlRippleModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MdlButtonModule,
    MdlIconModule,
    MdlRippleModule,
    MdlDialogModule
  ],
  exports: [],
  declarations: [ DatePickerDialogComponent ],
  entryComponents: [DatePickerDialogComponent],
  providers: [
    MdlDatePickerService,
    MdlDialogService
  ]
})
export class MdlDatePickerModule {
}
