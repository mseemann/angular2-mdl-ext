import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MdlSelectModule, MdlSelectComponent } from './select';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MdlSelect', () => {

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MdlSelectModule.forRoot()],
            declarations: [TestComponent],
        });

        TestBed.compileComponents().then( () => {
            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
        });
    }));


    // FIXME renderValue code
    // this.optionComponents.forEach((selectOptionComponent) => {
    //     selectOptionComponent.selectedValue = value; // <-- this line
    // });
    // retsults in error:
    // Error in dist/@angular2-mdl-ext/select/select.html:9:6 caused by:
    // Expression has changed after it was checked. Previous value: ''.
    // Current value: 'Bryan Cranston'.
    xit('should create the component and add the mdl-select css class', async(() => {

        let selectComponent = fixture.debugElement.query(By.directive(MdlSelectComponent));

        let selectNativeElement = selectComponent.nativeElement;

        expect(selectNativeElement.classList.contains('mdl-select'))
            .toBe(true, 'did not has css class mdl-select')

    }));
});

@Component({
    selector: 'test-component',
    template: `
        <mdl-select [(ngModel)]="personId">
          <mdl-option *ngFor="let p of people" [value]="p.id">{{p.name}}</mdl-option>
        </mdl-select>
    `
})
class TestComponent {
    personId: number = 1;
    people: any[] = [
        {id: 1, name: 'Bryan Cranston'},
        {id: 2, name: 'Aaron Paul'},
        {id: 3, name: 'Bob Odenkirk'},
    ];
}
