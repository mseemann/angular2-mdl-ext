import {
  Component, HostListener, Inject, InjectionToken, OpaqueToken, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MdlButtonComponent, MdlDialogReference } from '@angular-mdl/core';
import * as moment from 'moment';
import { DatePickerOptions } from './datepicker.service';

export const CURRENT_DATE = new InjectionToken<Date>('current-date');
export const DATEPICKER_CONFIG = new InjectionToken<DatePickerOptions>('datepicker-options');

@Component({
  moduleId: module.id,
  selector: 'datepicker',
  templateUrl: 'datepicker.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DatePickerDialogComponent {

  @ViewChild('okButton') public okButton: MdlButtonComponent;

  public okLabel: string;
  public cancelLabel: string;

  public mDate: any;
  private _mCurrentMonth: any;
  get mCurrentMonth() {
    return this._mCurrentMonth;
  }
  set mCurrentMonth(m) {
    this._mCurrentMonth = m;
    this.calculateMonthGrid();
  }

  public prevEnabled = true;
  public nextEnabled = true;

  public monthGridWeekDays: string[];
  public monthGridDays: any[];

  constructor(
    private dialog: MdlDialogReference,
    @Inject(CURRENT_DATE) private initialDate: Date,
    @Inject(DATEPICKER_CONFIG) private options: DatePickerOptions) {

    this.mDate = moment(initialDate || new Date());
    this.mCurrentMonth = moment(this.mDate);
    this.okLabel = options.okLabel || 'Ok';
    this.cancelLabel = options.cancelLabel || 'Cancel';

    dialog.onVisible().subscribe( () => {
      this.okButton.elementRef.nativeElement.focus();
    })
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialog.hide(this.initialDate);
  }

  public onOk() {
    this.dialog.hide(this.mDate.toDate());
  }

  public onCancel() {
    this.dialog.hide(this.initialDate);
  }

  public prevMonth() {
    this.mCurrentMonth = this.mCurrentMonth.subtract(1, 'months');
  }

  public nextMonth() {
    this.mCurrentMonth = this.mCurrentMonth.add(1, 'months');
  }

  private calculateMonthGrid() {
    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');

    this.monthGridWeekDays = [];
    var day = startOfWeek;
    while (day <= endOfWeek) {
      this.monthGridWeekDays.push(moment.weekdaysMin(day.day()));
      day = day.clone().add(1, 'd');
    }

    let startDateOfMonth = this.mCurrentMonth.startOf('month').clone();
    const startWeek = startDateOfMonth.week();
    const endWeek = this.mCurrentMonth.endOf('month').week();

    // caveat year switch
    // 52 - 5
    // 48 - 1
    // console.log(startWeek, endWeek);

    this.monthGridDays = [];
    let week = startWeek;

    this.monthGridDays.push(this.createMonthRow(startDateOfMonth, week));

    do {
      let firstDayInWeek = startDateOfMonth.add(1, 'week');
      week = firstDayInWeek.week();
      this.monthGridDays.push(this.createMonthRow(this.mCurrentMonth, week));
    } while (week != endWeek)

  }

  private createMonthRow(mDate: any, week: number) {
    return {
      week: week,
      days: Array(7).fill(0).map((n, i) => {
        var mDay = mDate.week(week).startOf('week').clone().add(n + i, 'day');
        return {
          day: mDay,
          isActual: this.isActualDate(mDay),
          isCurrentMonth: !this.isCurrentMonth(mDay)
        };
      })
    }
  }

  private isActualDate( day: any ) : boolean {
    return this.mDate.isSame(day, 'day');
  }

  private isCurrentMonth(day: any) : boolean {
    return this.mCurrentMonth.isSame(day, 'month');
  }

  public setCurrentDay(day: any) {
    this.mDate = day;
  }
}
