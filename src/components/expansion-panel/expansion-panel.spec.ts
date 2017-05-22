import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { MdlExpansionPanelModule } from './expansion-panel.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MdlExpansionPanel', () => {

  describe('single', () => {

    let fixture: ComponentFixture<TestSinglePanelComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MdlExpansionPanelModule.forRoot(), NoopAnimationsModule],
        declarations: [TestSinglePanelComponent],
      });

      TestBed.compileComponents().then( () => {
        fixture = TestBed.createComponent(TestSinglePanelComponent);
        fixture.detectChanges();
      });
    }));

    it('should be collapsed initially', async(() => {
      expect(fixture.debugElement.query(By.css('.expanded'))).toBeNull();
    }));

    it('should toggle on clicking expansion icon', async(() => {
      fixture.debugElement.nativeElement.querySelector('.mdl-expansion-panel__header--expand-icon').click();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(fixture.debugElement.query(By.css('.expanded'))).not.toBeNull();
          fixture.debugElement.nativeElement.querySelector('.mdl-expansion-panel__header--expand-icon').click();
          fixture.detectChanges();
          return fixture.whenStable();
        })
        .then(() => {
          expect(fixture.debugElement.query(By.css('.expanded'))).toBeNull();
        });
    }));

    it('should toggle on pressing enter if focused', async(() => {
      let e = new KeyboardEvent('keyup', {
        key: 'Enter'
      });
      fixture.debugElement.nativeElement.querySelector('.mdl-expansion-panel').dispatchEvent(e);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.debugElement.query(By.css('.expanded'))).not.toBeNull();
      });
    }));

    it('should not toggle if disabled', async(() => {
      fixture.debugElement.nativeElement.querySelector('button').click();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          fixture.debugElement.nativeElement.querySelector('.mdl-expansion-panel__header--expand-icon').click();
          fixture.detectChanges();
          return fixture.whenStable();
        })
        .then(() => {
          expect(fixture.debugElement.query(By.css('.expanded'))).toBeNull();
        });
    }));
  });

  describe('group', () => {

    let fixture: ComponentFixture<TestGroupPanelComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MdlExpansionPanelModule.forRoot(), NoopAnimationsModule],
        declarations: [TestGroupPanelComponent],
      });

      TestBed.compileComponents().then( () => {
        fixture = TestBed.createComponent(TestGroupPanelComponent);
        fixture.detectChanges();
      });
    }));

    it('should collapse previous panel', async(() => {
      fixture
        .debugElement
        .nativeElement
        .querySelector('.mdl-expansion-panel:nth-child(1) .mdl-expansion-panel__header--expand-icon')
        .click();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          fixture.debugElement.nativeElement
            .querySelector('.mdl-expansion-panel:nth-child(2) .mdl-expansion-panel__header--expand-icon')
            .click();
          fixture.detectChanges();
          return fixture.whenStable();
        })
        .then(() => {
          expect(fixture.debugElement.nativeElement
                  .querySelector('.mdl-expansion-panel:nth-child(1)').getAttribute('class'))
                  .not.toContain('expanded');
          expect(fixture.debugElement.nativeElement
                  .querySelector('.mdl-expansion-panel:nth-child(2)').getAttribute('class'))
                  .toContain('expanded');
        });
    }));

    it('should allow ONE panel which is initialized in expanded state', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.debugElement.nativeElement
          .querySelector('.mdl-expansion-panel:nth-child(1)').getAttribute('class'))
          .not.toContain('expanded');
        expect(fixture.debugElement.nativeElement
          .querySelector('.mdl-expansion-panel:nth-child(2)').getAttribute('class'))
          .not.toContain('expanded');
        expect(fixture.debugElement.nativeElement
          .querySelector('.mdl-expansion-panel:nth-child(3)').getAttribute('class'))
          .toContain('expanded');
      });
    }));
  });


  describe("customized initialization", () => {

    let fixture: ComponentFixture<TestGroupPanelComponent>;
    let panel: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MdlExpansionPanelModule.forRoot(), NoopAnimationsModule],
        declarations: [TestPanelHostComponent],
      });

      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(TestPanelHostComponent);
        fixture.detectChanges();

        panel = fixture.debugElement.query(By.css("mdl-expansion-panel"));
      });
    }));

    it("should be disabled depending on input", () => {
      expect(panel.classes).toEqual(
        jasmine.objectContaining({disabled: true}),
      );
    });

    it("should be expanded depending on input", () => {
      expect(panel.classes).toEqual(
        jasmine.objectContaining({expanded: true}),
      );
    });
  });
});

@Component({
  selector: 'test-component',
  template: `
    <mdl-expansion-panel #panel>
      <mdl-expansion-panel-header></mdl-expansion-panel-header>
      <mdl-expansion-panel-content><p>body</p></mdl-expansion-panel-content>
    </mdl-expansion-panel>
    <button (click)="panel.disabled = true"></button>
  `
})
class TestSinglePanelComponent {}

@Component({
  selector: 'test-group-component',
  template: `
    <mdl-expansion-panel-group #panelGroup>
      <mdl-expansion-panel *ngFor="let i of [1,2,3]" [expanded]="true">
        <mdl-expansion-panel-header></mdl-expansion-panel-header>
        <mdl-expansion-panel-content><p>body</p></mdl-expansion-panel-content>
      </mdl-expansion-panel>
    </mdl-expansion-panel-group>
  `
})
class TestGroupPanelComponent {}

@Component({
  selector: 'test-host-component',
  template: `
      <mdl-expansion-panel [disabled]="disabled" [expanded]="expanded">
        <mdl-expansion-panel-header></mdl-expansion-panel-header>
        <mdl-expansion-panel-content><p>body</p></mdl-expansion-panel-content>
      </mdl-expansion-panel>
  `
})
class TestPanelHostComponent {
  public disabled: boolean = true;
  public expanded: boolean = true;
}