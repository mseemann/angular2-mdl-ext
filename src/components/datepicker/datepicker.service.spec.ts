import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdlDatePickerModule } from './index';
import { CommonModule } from '@angular/common';
import { MdlButtonModule, MdlDialogOutletModule, MdlIconModule, MdlRippleModule } from '@angular-mdl/core';
import { MdlDatePickerService } from './datepicker.service';
import * as moment from 'moment'

describe('DatePickerService', () => {


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MdlButtonModule,
        MdlIconModule,
        MdlRippleModule,
        MdlDatePickerModule,
        MdlDialogOutletModule
      ],
      declarations: [ MdlTestComponent ]
    });

    TestBed.compileComponents();
  }));

  it('should instantiate the service', async(() => {
    const service: MdlDatePickerService = TestBed.get(MdlDatePickerService);
    expect(service).toBeDefined();
  }));

  it('should open the date picker dialog', ( done: any) => {

    let fixture = TestBed.createComponent(MdlTestComponent);

    const service: MdlDatePickerService = TestBed.get(MdlDatePickerService);
    service.selectDate().subscribe( (date) => {
      expect(date).toBeDefined();
      done();
    });

    // render the dialog component
    fixture.detectChanges();

    // give the service time to subscribe to the dialog hide call.
    setTimeout( () => {

      let cancelButton = fixture.debugElement.query(By.css('.mdl-datepicker-cancel-button')).nativeElement;
      expect(cancelButton.textContent).toBe('Cancel');

      let okButton = fixture.debugElement.query(By.css('.mdl-datepicker-ok-button')).nativeElement;
      expect(okButton.textContent).toBe('Ok');
      okButton.click();

    });

  });

  it('should open the date picker dialog with a provided date', () => {
    let fixture = TestBed.createComponent(MdlTestComponent);

    const service: MdlDatePickerService = TestBed.get(MdlDatePickerService);
    service.selectDate(moment('2017-01-01').toDate());

    // render the dialog component
    fixture.detectChanges();

    let yearEl = fixture.debugElement.query(By.css('.mdl-datepicker-header-year')).nativeElement;
    expect(yearEl.textContent).toBe('2017');

    let dayEl = fixture.debugElement.query(By.css('.mdl-datepicker-header-day-month')).nativeElement;
    expect(dayEl.textContent).toBe('Sun, Jan 01');

  });

  it('should open the date picker dialog with a ok and cancel label', () => {
    let fixture = TestBed.createComponent(MdlTestComponent);

    const service: MdlDatePickerService = TestBed.get(MdlDatePickerService);
    service.selectDate(null, {okLabel: '1', cancelLabel: '2'});

    // render the dialog component
    fixture.detectChanges();


    let cancelButton = fixture.debugElement.query(By.css('.mdl-datepicker-cancel-button')).nativeElement;
    expect(cancelButton.textContent).toBe('2');

    let okButton = fixture.debugElement.query(By.css('.mdl-datepicker-ok-button')).nativeElement;
    expect(okButton.textContent).toBe('1');

  });

});

@Component({
  selector: 'test-component',
  template: `      
      <dialog-outlet></dialog-outlet>
  `
})
class MdlTestComponent {

}