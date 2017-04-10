import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { MdlDatePickerService } from '../../../components/datepicker/datepicker.service';
import * as moment from 'moment';
//import 'moment/locale/de';

@Component({
  selector: 'datepicker-demo',
  templateUrl: 'datepicker.component.html'
})
export class DatepickerDemo {

  public selectedDate: any;

  constructor(private datePicker: MdlDatePickerService) {}

  public pickADate($event: MouseEvent) {
    this.datePicker.selectDate(this.selectedDate, {openFrom: $event}).subscribe( (selectedDate: Date) => {
      this.selectedDate = selectedDate ? moment(selectedDate) : null;
    });
  }
}
