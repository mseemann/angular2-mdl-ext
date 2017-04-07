import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MdlDialogReference, MdlDialogService } from '@angular-mdl/core';
import { CURRENT_DATE, DatePickerDialogComponent } from './datepicker.component';


export interface DatePickerOptions {
  openFrom?: MouseEvent;
}

@Injectable()
export class MdlDatePickerService {

  constructor( private dialogService: MdlDialogService) {}

  public selectDate(currentDate: Date = null, options: DatePickerOptions = {}) : Observable<Date> {
    let subject = new Subject<Date>();

    let pDialog = this.dialogService.showCustomDialog({
      component: DatePickerDialogComponent,
      providers: [{provide: CURRENT_DATE, useValue: currentDate}],
      isModal: true,
      openFrom: options.openFrom
    });
    pDialog.subscribe( (dialogReference: MdlDialogReference) => {
     dialogReference.onHide().subscribe( () => {


       subject.next();

     });
    });

    return subject.asObservable();
  }
}