import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MdlSelectModule, MdlSelectComponent } from './select';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('MdlSelect', () => {

    describe('single', () => {

        let fixture: ComponentFixture<TestSingleComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MdlSelectModule.forRoot()],
                declarations: [TestSingleComponent],
            });

            TestBed.compileComponents().then( () => {
                fixture = TestBed.createComponent(TestSingleComponent);
                fixture.detectChanges();
            });
        }));


        it('should create the component and add the mdl-select css class', async(() => {

            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

            let selectNativeElement = selectComponent.nativeElement;

            expect(selectNativeElement.classList.contains('mdl-select'))
                .toBe(true, 'did not has css class mdl-select')

        }));

        it('should support ngModel', async(() => {

            let testInstance = fixture.componentInstance;
            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            fixture.whenStable().then(() => {
                expect(selectComponent.ngModel)
                  .toEqual(1, 'did not init ngModel');

                testInstance.personId = 2;

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(selectComponent.ngModel)
                      .toEqual(2, 'did not update ngModel')
                });
            });

        }));

        it('should reset ngModel', async(() => {

            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            spyOn(selectComponentInstance, 'bindOptions');

            fixture.whenStable().then(() => {
                expect(selectComponentInstance.ngModel)
                  .toEqual(1, 'did not init ngModel');

                selectComponentInstance.reset();

                expect(selectComponentInstance.bindOptions)
                  .toHaveBeenCalled();

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(selectComponentInstance.ngModel)
                      .toEqual('', 'did not reset ngModel')
                });
            });

        }));

    });

    describe('disabled', () => {

        let fixture: ComponentFixture<TestDisabledComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MdlSelectModule.forRoot(), ReactiveFormsModule],
                declarations: [TestDisabledComponent]
            });

            TestBed.compileComponents().then( () => {
                fixture = TestBed.createComponent(TestDisabledComponent);
                fixture.detectChanges();
            });
        }));

        it('should create the component and make it disabled', async(() => {

            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            fixture.whenStable().then(() => {
                expect(selectComponent.disabled)
                  .toBe(true, 'select field should be disabled');
            });
        }))
    })

    describe('multiple', () => {

        let fixture: ComponentFixture<TestMultipleComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MdlSelectModule.forRoot()],
                declarations: [TestMultipleComponent],
            });

            TestBed.compileComponents().then( () => {
                fixture = TestBed.createComponent(TestMultipleComponent);
                fixture.detectChanges();
            });
        }));

        it('should create the component and add the mdl-select css class', async(() => {

            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

            let selectNativeElement = selectComponent.nativeElement;

            expect(selectNativeElement.classList.contains('mdl-select'))
              .toBe(true, 'did not have css class mdl-select')

        }));

        it('should support ngModel', async(() => {

            let testInstance = fixture.componentInstance;
            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            fixture.whenStable().then(() => {
                expect(selectComponentInstance.ngModel)
                  .toEqual([ 1, 2 ], 'did not init ngModel');

                testInstance.personIds = [ 1 ];

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(selectComponentInstance.ngModel)
                      .toEqual([ 1 ], 'did not update ngModel')
                });
            });

        }));

        it('should reset ngModel', async(() => {

            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            spyOn(selectComponentInstance, 'bindOptions');

            fixture.whenStable().then(() => {
                expect(selectComponentInstance.ngModel)
                  .toEqual([ 1, 2 ], 'did not init ngModel');

                selectComponentInstance.reset();

                expect(selectComponentInstance.bindOptions)
                  .toHaveBeenCalled();

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(selectComponentInstance.ngModel)
                      .toEqual([ ], 'did not reset ngModel')
                });
            });

        }));

        it('should select and deselect value', async(() => {

            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            const event = <Event>jasmine.createSpyObj('event', ['stopPropagation']);

            expect(selectComponentInstance.multiple)
              .toBe(true, 'is not multiple');

            selectComponentInstance.onSelect(event, 3);

            expect(event.stopPropagation)
              .toHaveBeenCalled();

            fixture.detectChanges();
            fixture.whenStable().then(() => {

                expect(selectComponentInstance.ngModel)
                  .toEqual([ 1, 2, 3 ], 'did not update ngModel on select 3');

                selectComponentInstance.onSelect(event, 3);

                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(selectComponentInstance.ngModel)
                      .toEqual([ 1, 2 ], 'did not update ngModel on deselect 3');

                });

            });

        }));
    });
});

@Component({
  selector: 'test-disabled-component',
  template: `
    <form [formGroup]="form">
      <mdl-select formControlName="personId">
        <mdl-option *ngFor="let p of people" [value]="p.id">{{p.name}}</mdl-option>
      </mdl-select>
    </form>
  `
})

class TestDisabledComponent {
  form: FormGroup;
  personId: FormControl = new FormControl({value: 1, disabled: true});
  people: any[] = [
      {id: 1, name: 'Bryan Cranston'},
      {id: 2, name: 'Aaron Paul'},
      {id: 3, name: 'Bob Odenkirk'},
  ];

  constructor() {
    this.form = new FormGroup({
      personId: this.personId
    });
  }
}

@Component({
    selector: 'test-single-component',
    template: `
        <mdl-select [(ngModel)]="personId">
          <mdl-option *ngFor="let p of people" [value]="p.id">{{p.name}}</mdl-option>
        </mdl-select>
    `
})
class TestSingleComponent {
    personId: number = 1;
    people: any[] = [
        {id: 1, name: 'Bryan Cranston'},
        {id: 2, name: 'Aaron Paul'},
        {id: 3, name: 'Bob Odenkirk'},
    ];
}

@Component({
    selector: 'test-multiple-component',
    template: `
        <mdl-select [(ngModel)]="personIds" [multiple]="true">
          <mdl-option *ngFor="let p of people" [value]="p.id">{{p.name}}</mdl-option>
        </mdl-select>
    `
})
class TestMultipleComponent {
    personIds: number[] = [1, 2];
    people: any[] = [
        {id: 1, name: 'Bryan Cranston'},
        {id: 2, name: 'Aaron Paul'},
        {id: 3, name: 'Bob Odenkirk'},
    ];
}
