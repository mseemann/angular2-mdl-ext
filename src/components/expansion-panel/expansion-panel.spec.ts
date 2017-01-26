import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdlExpansionPanelModule } from './expansion-panel.component';

describe('MdlExpansionPanel', () => {

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MdlExpansionPanelModule.forRoot()],
            declarations: [TestComponent],
        });

        TestBed.compileComponents().then( () => {
            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
        });
    }));


    it('should ...', async(() => {
        expect(fixture).toBeDefined();
    }));

});

@Component({
    selector: 'test-component',
    template: `
      <button (click)="popover.toggle($event)">button</button>
      <mdl-expansion-panel>
        <mdl-expansion-panel-header></mdl-expansion-panel-header>
      </mdl-expansion-panel>
    `
})
class TestComponent {}
