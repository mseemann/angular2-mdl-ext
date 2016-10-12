import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MdlPopoverModule, MdlPopoverComponent } from './popover';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MdlPopover', () => {

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MdlPopoverModule.forRoot()],
            declarations: [TestComponent],
        });

        TestBed.compileComponents().then( () => {
            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
        });
    }));


    it('should create the component and add the mdl-popover css class', async(() => {

        let popoverComponent = fixture.debugElement.query(By.directive(MdlPopoverComponent));

        let popoverNativeElement = popoverComponent.nativeElement;

        expect(popoverNativeElement.classList.contains('mdl-popover'))
            .toBe(true, 'did not has css class mdl-popover')

    }));

    it('should hide on click outside of popover', async(() => {

        let popoverComponent = fixture.debugElement.query(By.directive(MdlPopoverComponent));

        let popoverComponentInstance = popoverComponent.componentInstance;

        popoverComponentInstance.isVisible = true;

        spyOn(popoverComponentInstance, 'hide');

        fixture.debugElement.nativeElement.click();

        expect(popoverComponentInstance.hide)
          .toHaveBeenCalled();

    }));

    it('should toggle popover on button click', async(() => {

        let popoverComponent = fixture.debugElement.query(By.directive(MdlPopoverComponent));

        let popoverNativeElement = popoverComponent.nativeElement;

        let buttonNativeElement = fixture.debugElement.query(By.css('button')).nativeElement;

        let popoverComponentInstance = popoverComponent.componentInstance;

        expect(popoverComponentInstance.isVisible)
          .toEqual(false, 'isVisible is not false');

        expect(popoverNativeElement.classList.contains('is-visible'))
          .toBe(false, 'did has css class is-visible');

        spyOn(popoverComponentInstance, 'toggle').and.callThrough();

        spyOn(popoverComponentInstance, 'hideAllPopovers').and.callThrough();

        spyOn(popoverComponentInstance, 'updateDirection').and.callThrough();

        buttonNativeElement.click();

        expect(popoverComponentInstance.toggle).toHaveBeenCalled();

        expect(popoverComponentInstance.hideAllPopovers).toHaveBeenCalled();

        expect(popoverComponentInstance.updateDirection).toHaveBeenCalled();

        expect(popoverComponentInstance.isVisible)
          .toEqual(true, 'toggle did not update isVisible to true');

        fixture.detectChanges();
        fixture.whenStable().then(() => {

            expect(popoverNativeElement.classList.contains('is-visible'))
              .toBe(true, 'did not has css class is-visible');

        });

    }));

});

@Component({
    selector: 'test-component',
    template: `
      <button (click)="popover.toggle($event)">button</button>
      <mdl-popover #popover>popover content</mdl-popover>
    `
})
class TestComponent {}
