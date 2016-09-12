

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MdlPopoverModule, MdlPopoverComponent } from './popover';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MdlPopover', () => {

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MdlPopoverModule],
            declarations: [TestComponent],
        });

        TestBed.compileComponents().then( () => {
            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
        });
    }));


    it('should create the component and add the mdl-popover__container css class',  async(() => {

        let popoverComponent = fixture.debugElement.query(By.directive(MdlPopoverComponent));

        let popoverNativeElement = popoverComponent.nativeElement;

        expect(popoverNativeElement.classList.contains('mdl-popover__container'))
            .toBe(true, 'did not has css class mdl-popover__container')

    }));
});

@Component({
    selector: 'test-component',
    template: '<mdl-popover>test</mdl-popover>'
})
class TestComponent {}