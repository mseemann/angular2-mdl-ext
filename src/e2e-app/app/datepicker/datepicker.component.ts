import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { MdlDatePickerService } from '../../../components/datepicker/datepicker.service';

@Component({
  selector: 'datepicker-demo',
  templateUrl: 'datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerDemo {

  public selectedDate: Date;

  constructor(private datePicker: MdlDatePickerService) {}

  public pickADate($event: MouseEvent) {
    this.datePicker.selectDate(this.selectedDate, {openFrom: $event}).subscribe( (selectedDate: Date) => {
      this.selectedDate = selectedDate;
    });
  }
}
