import { ModuleWithProviders, NgModule } from '@angular/core';
import { MdlDatePickerService } from './datepicker.service';
import { DatePickerDialogComponent } from './datepicker.component';
import { MdlButtonModule } from '@angular-mdl/core';

@NgModule({
  imports: [ MdlButtonModule ],
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
