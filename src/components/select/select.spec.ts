import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MdlSelectModule, MdlSelectComponent } from './select';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Key } from './keyboard';

// based on @angular/cdk
export function createKeyboardEvent(type: string, keyCode: number, target?: Element) {
    let event = document.createEvent('KeyboardEvent') as any;
    // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
    let initEventFn = (event.initKeyEvent || event.initKeyboardEvent).bind(event);
    let originalPreventDefault = event.preventDefault;

    initEventFn(type, true, true, window, 0, 0, 0, 0, 0, keyCode);

    // Webkit Browsers don't set the keyCode when calling the init function.
    // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
    Object.defineProperties(event, {
        keyCode: { get: () => keyCode },
        target: { get: () => target }
    });

    // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
    event.preventDefault = function() {
        Object.defineProperty(event, 'defaultPrevented', { get: () => true });
        return originalPreventDefault.apply(this, arguments);
    };

    return event;
}

// based on @angular/cdk
export function dispatchEvent(node: Node | Window, event: Event): Event {
    node.dispatchEvent(event);
    return event;
}

export function dispatchKeydownEvent(node: any, keycode: number) {
    return dispatchEvent(node, createKeyboardEvent('keydown', keycode, node));
}

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

        it('should support floating-label attr', async(() => {

            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

            let selectNativeElement = selectComponent.nativeElement;

            expect(selectNativeElement.classList.contains('mdl-select--floating-label'))
                .toBe(true, 'did not has css class mdl-select--floating-label')

            expect(selectComponent.nativeElement.querySelector('.mdl-textfield__label').innerText)
                .toBe(selectComponent.componentInstance.label, 'did not set correct label text');
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

            fixture.whenStable().then(() => {
                expect(selectComponentInstance.ngModel)
                  .toEqual(1, 'did not init ngModel');

                selectComponentInstance.reset();

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(selectComponentInstance.ngModel)
                      .toEqual('', 'did not reset ngModel')
                });
            });

        }));

        it('should bind options on options change', async(() => {

            let testInstance = fixture.componentInstance;
            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            spyOn(selectComponentInstance, 'bindOptions').and.callThrough();

            testInstance.people.push({id: 4, name: 'Gary Cole'});

            fixture.detectChanges();
            fixture.whenStable().then(() => {

                expect(selectComponentInstance.bindOptions)
                  .toHaveBeenCalled();

                expect(selectComponentInstance.textByValue[4])
                  .toEqual('Gary Cole');

            });
        }));

        it('focus should have keyboard events', async(() => {

            jasmine.clock().uninstall();
            jasmine.clock().install();

            let testInstance = fixture.componentInstance;

            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

            let selectNativeElement = selectComponent.nativeElement;

            let selectComponentInstance = selectComponent.componentInstance;

            spyOn(selectComponentInstance, 'onKeyDown').and.callThrough();

            spyOn(selectComponentInstance, 'onArrow').and.callThrough();
            
            //console.log(selectNativeElement.querySelector("span[tabindex]"));
            //document.body.appendChild(selectNativeElement);

            selectNativeElement.querySelector("span[tabindex]").focus();
            jasmine.clock().tick(500); // onFocus timeout is cleared
            fixture.detectChanges();

            expect(selectComponentInstance.popoverComponent.isVisible)
                .toEqual(true, 'toggle did not update isVisible to true');

            dispatchKeydownEvent(selectNativeElement.querySelector("span"), Key.DownArrow);

            dispatchKeydownEvent(selectNativeElement.querySelector("span"), Key.UpArrow);

            dispatchKeydownEvent(selectNativeElement.querySelector("span"), Key.Tab);

            fixture.detectChanges();

            fixture.debugElement.nativeElement.click(); // click outside select to close
            fixture.detectChanges();

            expect(selectComponentInstance.popoverComponent.isVisible)
                .toEqual(false, 'toggle did not update isVisible to false');

            expect(selectComponentInstance.onKeyDown).toHaveBeenCalled();
            expect(selectComponentInstance.onArrow.calls.allArgs().map((args: any) => args[1])).toEqual([1, -1]);

            jasmine.clock().uninstall();
        }));

         it('should auto-select searched options', async(() => {
            
            jasmine.clock().uninstall();
            jasmine.clock().install();

            let testInstance = fixture.componentInstance;

            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

            let selectNativeElement = selectComponent.nativeElement;

            let selectComponentInstance = selectComponent.componentInstance;

            spyOn(selectComponentInstance, 'onSelect').and.callThrough();
            spyOn(selectComponentInstance, 'onCharacterKeydown').and.callThrough();

            selectNativeElement.querySelector("span[tabindex]").focus();
            jasmine.clock().tick(500); // onFocus timeout is cleared
            fixture.detectChanges();

            expect(selectComponentInstance.ngModel).toEqual(1);
            dispatchKeydownEvent(selectNativeElement, Key.B);
            fixture.detectChanges();

            expect(selectComponentInstance.onSelect).not.toHaveBeenCalled();
            expect(selectComponentInstance.onCharacterKeydown).toHaveBeenCalled();
            expect(selectComponentInstance.ngModel).toEqual(1);

            dispatchKeydownEvent(selectNativeElement, Key.O);
            fixture.detectChanges();

            expect(selectComponentInstance.onSelect).toHaveBeenCalled();
            expect(selectComponentInstance.searchQuery).toEqual('bo');
            expect(selectComponentInstance.ngModel).toEqual(3); // B and O typed, so 'Bob Odenkirk' selected

            jasmine.clock().tick(300); // search query timeout is cleared

            expect(selectComponentInstance.searchQuery).toEqual('');

            dispatchKeydownEvent(selectNativeElement, Key.A);
            fixture.detectChanges();

            expect(selectComponentInstance.onSelect).toHaveBeenCalled();
            expect(selectComponentInstance.ngModel).toEqual(2); // A typed, so 'Aaron Paul' selected

            jasmine.clock().uninstall();
        }));

    });

    describe('single, without model', () => {

        let fixture: ComponentFixture<TestSingleComponentNoModel>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MdlSelectModule.forRoot()],
                declarations: [TestSingleComponentNoModel],
            });

            TestBed.compileComponents().then( () => {
                fixture = TestBed.createComponent(TestSingleComponentNoModel);
                fixture.detectChanges();
            });
        }));

        it('should select vlaue and display text', async(() => {

            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            let noModelData = [
              {value: 'first', text: 'Bryan Cranston'},
              {value: 'second', text: 'Aaron Paul'},
              {value: 'third', text: 'Bob Odenkirk'}
            ];

            selectComponentInstance.onSelect(noModelData[0].value);

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(selectComponentInstance.text)
                  .toEqual( noModelData[0].text);

                  selectComponentInstance.onSelect(noModelData[1].value);

                  fixture.detectChanges();
                  fixture.whenStable().then(() => {
                    expect(selectComponentInstance.text)
                    .toEqual( noModelData[1].text);
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

    describe('autocomplete', () => {
        let fixture: ComponentFixture<TestAutoCompleteComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MdlSelectModule.forRoot()],
                declarations: [TestAutoCompleteComponent],
            });

            TestBed.compileComponents().then( () => {
                fixture = TestBed.createComponent(TestAutoCompleteComponent);
                fixture.detectChanges();
            });
        }));

        it('should not make autoselection when it\'s on', async(() => {
            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

            let selectNativeElement = selectComponent.nativeElement;

            let selectComponentInstance = selectComponent.componentInstance;

            spyOn(selectComponentInstance, 'onSelect').and.callThrough();
            spyOn(selectComponentInstance, 'onCharacterKeydown').and.callThrough();

            selectNativeElement.querySelector("input").focus();
            fixture.detectChanges();

            expect(selectComponentInstance.ngModel).toBeNull();
            dispatchKeydownEvent(selectNativeElement, Key.B);
            fixture.detectChanges();

            expect(selectComponentInstance.ngModel).toBeNull();
        }));

        it('should make autoselection on enter', async(() => {
            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

            let selectNativeElement = selectComponent.nativeElement;

            let selectComponentInstance = selectComponent.componentInstance;

            let input = selectNativeElement.querySelector("input");

            spyOn(selectComponentInstance, 'onSelect').and.callThrough();
            spyOn(selectComponentInstance, 'onCharacterKeydown').and.callThrough();
            input.focus();

            fixture.detectChanges();
            expect(selectComponentInstance.ngModel).toBeNull();

            dispatchEvent(input, createKeyboardEvent('keyup', Key.B, input));
            fixture.detectChanges();
            expect(selectComponentInstance.ngModel).toBeNull();

            dispatchEvent(input, createKeyboardEvent('keyup', Key.Enter, input));
            fixture.detectChanges();
            expect(selectComponentInstance.ngModel).toEqual(1);
        }));

        it('should make input writable when autoselection is off', async(() => {
            let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

            let selectNativeElement = selectComponent.nativeElement;

            expect(selectNativeElement.querySelector("input").readonly).toBeFalsy();
        }));
    });

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

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(selectComponentInstance.ngModel)
                      .toEqual([ ], 'did not reset ngModel')
                });
            });

        }));

        it('should select and deselect value', async(() => {

            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            expect(selectComponentInstance.multiple)
              .toBe(true, 'is not multiple');

            selectComponentInstance.onSelect(3);

            fixture.detectChanges();
            fixture.whenStable().then(() => {

                expect(selectComponentInstance.ngModel)
                  .toEqual([ 1, 2, 3 ], 'did not update ngModel on select 3');

                selectComponentInstance.onSelect(3);

                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(selectComponentInstance.ngModel)
                      .toEqual([ 1, 2 ], 'did not update ngModel on deselect 3');

                });

            });

        }));

        it('should bind options on options change', async(() => {

            let testInstance = fixture.componentInstance;
            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            spyOn(selectComponentInstance, 'bindOptions').and.callThrough();

            testInstance.people.push({id: 4, name: 'Gary Cole'});

            fixture.detectChanges();
            fixture.whenStable().then(() => {

                expect(selectComponentInstance.bindOptions)
                  .toHaveBeenCalled();

                expect(selectComponentInstance.textByValue[4])
                  .toEqual('Gary Cole');

            });
        }));
    });
    describe('object', () => {

        let fixture: ComponentFixture<TestObjectComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MdlSelectModule.forRoot()],
                declarations: [TestObjectComponent],
            });

            TestBed.compileComponents().then( () => {
                fixture = TestBed.createComponent(TestObjectComponent);
                fixture.detectChanges();
            });
        }));

        it('should support ngModel', async(() => {

            let testInstance = fixture.componentInstance;
            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            fixture.whenStable().then(() => {
                expect(selectComponentInstance.ngModel)
                  .toEqual( [{i: 1, n: 'Bryan Cranston'}, {i: 2, n: 'Aaron Paul'}], 'did not init ngModel');

                testInstance.personObjs = [{i: 1, n: 'Bryan Cranston'}];

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(selectComponentInstance.ngModel)
                      .toEqual( [{i: 1, n: 'Bryan Cranston'}], 'did not update ngModel')
                });
            });

        }));

        it('should reset ngModel', async(() => {

            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            spyOn(selectComponentInstance, 'bindOptions');

            fixture.whenStable().then(() => {
                expect(selectComponentInstance.ngModel)
                  .toEqual( [{i: 1, n: 'Bryan Cranston'}, {i: 2, n: 'Aaron Paul'}], 'did not init ngModel');

                selectComponentInstance.reset();

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(selectComponentInstance.ngModel)
                      .toEqual([ ], 'did not reset ngModel')
                });
            });

        }));

        it('should select and deselect value', async(() => {

            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            let arrWith3Obj = [{i: 1, n: 'Bryan Cranston'}, {i: 2, n: 'Aaron Paul'}, {i: 3, n: 'Bob Odenkirk'}];

            expect(selectComponentInstance.multiple)
              .toBe(true, 'is not multiple');

            selectComponentInstance.onSelect(arrWith3Obj[2]);

            fixture.detectChanges();
            fixture.whenStable().then(() => {

                expect(selectComponentInstance.ngModel)
                  .toEqual( arrWith3Obj, 'did not update ngModel on select 3');

                selectComponentInstance.onSelect(arrWith3Obj[2]);

                fixture.detectChanges();
                fixture.whenStable().then(() => {

                    expect(selectComponentInstance.ngModel)
                      .toEqual( [arrWith3Obj[0], arrWith3Obj[1]], 'did not update ngModel on deselect 3');

                    selectComponentInstance.onSelect(arrWith3Obj[1]);

                    fixture.detectChanges();
                    fixture.whenStable().then(() => {

                    expect(selectComponentInstance.ngModel)
                      .toEqual( [arrWith3Obj[0]], 'did not update ngModel on deselect 3');

                    });
                });


            });

        }));


        it('should bind options on options change', async(() => {

            let testInstance = fixture.componentInstance;
            let selectComponentInstance = fixture.debugElement.query(By.directive(MdlSelectComponent)).componentInstance;

            spyOn(selectComponentInstance, 'bindOptions').and.callThrough();

            testInstance.people.push({id: 4, name: 'Gary Cole'});

            fixture.detectChanges();
            fixture.whenStable().then(() => {

                expect(selectComponentInstance.bindOptions)
                  .toHaveBeenCalled();

                expect(selectComponentInstance.textByValue[JSON.stringify({i: 4, n: 'Gary Cole'})])
                  .toEqual('Gary Cole');

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
        <mdl-select label="{{label}}" floating-label [autocomplete]="true" [(ngModel)]="selectedValue">
          <mdl-option *ngFor="let p of people" [value]="p.id">{{p.name}}</mdl-option>
        </mdl-select>
    `
})
class TestAutoCompleteComponent {
    selectedValue: any = null;
    label: string = 'floating label';
    people: any[] = [
        {id: 1, name: 'Bryan Cranston'},
        {id: 2, name: 'Aaron Paul'},
        {id: 3, name: 'Bob Odenkirk'},
    ];
}

@Component({
    selector: 'test-single-component',
    template: `
        <mdl-select label="{{label}}" floating-label [(ngModel)]="personId">
          <mdl-option *ngFor="let p of people" [value]="p.id">{{p.name}}</mdl-option>
        </mdl-select>
    `
})
class TestSingleComponent {
    personId: number = 1;
    label: string = 'floating label';
    people: any[] = [
        {id: 1, name: 'Bryan Cranston'},
        {id: 2, name: 'Aaron Paul'},
        {id: 3, name: 'Bob Odenkirk'},
    ];
}

@Component({
    selector: 'test-single-component-no-model',
    template: `
        <mdl-select placeholder="{{placeholder}}">
          <mdl-option value="first">Bryan Cranston</mdl-option>
          <mdl-option value="second">Aaron Paul</mdl-option>
          <mdl-option value="third">Bob Odenkirk</mdl-option>
        </mdl-select>
    `
})
class TestSingleComponentNoModel {
    placeholder: string = 'no model';
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

@Component({
    selector: 'test-object-component',
    template: `
        <mdl-select [(ngModel)]="personObjs" [multiple]="true">
          <mdl-option *ngFor="let p of people" [value]="{ i: p.id, n: p.name }">{{p.name}}</mdl-option>
        </mdl-select>
    `
})
class TestObjectComponent {
    personObjs: any[] = [{i: 1, n: 'Bryan Cranston'}, {i: 2, n: 'Aaron Paul'}];
    people: any[] = [
        {id: 1, name: 'Bryan Cranston'},
        {id: 2, name: 'Aaron Paul'},
        {id: 3, name: 'Bob Odenkirk'},
    ];
}
