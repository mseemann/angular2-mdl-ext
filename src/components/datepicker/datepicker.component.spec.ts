import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdlDatePickerModule } from './index';
import { CommonModule } from '@angular/common';
import { MdlButtonModule, MdlDialogOutletModule, MdlIconModule, MdlRippleModule } from '@angular-mdl/core';
import { MdlDatePickerService } from './datepicker.service';

describe('DatePicker', () => {


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

      let okButton = fixture.debugElement.query(By.css('.mdl-datepicker-ok-button')).nativeElement;
      okButton.click();

    });


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