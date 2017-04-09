import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MdlDialogReference, MdlDialogService } from '@angular-mdl/core';
import { CURRENT_DATE, DATEPICKER_CONFIG, DatePickerDialogComponent } from './datepicker.component';


export interface DatePickerOptions {
  openFrom?: MouseEvent;
  okLabel?: string;
  cancelLabel?: string;
}

@Injectable()
export class MdlDatePickerService {

  constructor( private dialogService: MdlDialogService) {}

  public selectDate(currentDate: Date = null, options: DatePickerOptions = {}) : Observable<Date> {
    let subject = new Subject<Date>();

    let pDialog = this.dialogService.showCustomDialog({
      classes: 'mdl-datepicker',
      component: DatePickerDialogComponent,
      providers: [
        {provide: CURRENT_DATE, useValue: currentDate},
        {provide: DATEPICKER_CONFIG, useValue: options}
      ],
      isModal: true,
      styles: {'width': '320px'},
      openFrom: options.openFrom
    });
    pDialog.subscribe( (dialogReference: MdlDialogReference) => {
     dialogReference.onHide().subscribe( (date: Date) => {;
       subject.next(date);
     });
    });

    return subject.asObservable();
  }
}