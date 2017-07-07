import {async, ComponentFixture, TestBed} from '@angular/core/testing'
import {MdlFabMenuComponent, MdlFabMenuModule} from './fab-menu'
import {Component, DebugElement} from '@angular/core'
import {By} from '@angular/platform-browser'


describe('MdlFabMenuComponent', () => {


  let fixture: ComponentFixture<TestMdlFabMenuComponent>;

  /*

   beforeEach(async(() => {
   TestBed.configureTestingModule({
   imports: [
   CommonModule,
   MdlModule,
   MdlPopoverModule.forRoot()
   ],
   declarations: [MdlFabMenuComponent
   ],
   providers: [
   ]
   });

   TestBed.compileComponents().then(() => {
   fixture = TestBed.createComponent(MdlFabMenuComponent);
   fixture.detectChanges();
   });
   }));
   */

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdlFabMenuModule.forRoot()
      ],
      declarations: [TestMdlFabMenuComponent
      ],
      providers: []
    })/*.overrideComponent(MdlFabMenuItemComponent, {
     set: {
     templateUrl: '/Users/dad/Documents/freelance/surstrosti/angular2-mdl-ext/dist/@angular-mdl/fab-menu/fab-menu-item.html'
     }
     }
     )*/;

    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestMdlFabMenuComponent);
      fixture.detectChanges();
    });
  }));

  afterEach(() => {
    fixture = null
  })

  describe('FAB', () => {


    it('should instantiate the component', async(() => {
      expect(fixture).toBeDefined();
    }));

    it('should have the menu collapsed after the page loads', async(() => {
      let popoverComponent = fixture.debugElement.query(By.css('.mdl-popover'))
      let popoverComponentInstance = popoverComponent.componentInstance;

      expect(popoverComponentInstance.isVisible).toBeFalsy();

    }));

    it('should have the menu expanded after the user click once on the FAB', async(() => {
      let buttonComponent = fixture.debugElement.query(By.css('.mdl-button'))

      let popoverComponent = fixture.debugElement.query(By.css('.mdl-popover'))
      let popoverComponentInstance = popoverComponent.componentInstance;

      spyOn(popoverComponentInstance, 'toggle').and.callThrough();
      spyOn(popoverComponentInstance, 'show').and.callThrough();

      buttonComponent.nativeElement.click();

      expect(popoverComponentInstance.show)
          .toHaveBeenCalled();

      fixture.detectChanges();
      fixture.whenStable().then(() => {

        expect(popoverComponentInstance.isVisible).toBeTruthy();

      });


    }));

    it('should have the menu collapsed after the user click on one item', async(() => {

      let popoverComponent = fixture.debugElement.query(By.css('.mdl-popover'))

      let popoverNativeElement = popoverComponent.nativeElement;

      let buttonNativeElement = fixture.debugElement.query(By.css('.mdl-button')).nativeElement;

      let popoverComponentInstance = popoverComponent.componentInstance;

      let itemDebugElement: DebugElement = fixture.debugElement.query(By.css('#itemNotAlwaysTooltip > .mdl-button'))


      spyOn(popoverComponentInstance, 'toggle').and.callThrough();
      spyOn(popoverComponentInstance, 'hide').and.callThrough();

      buttonNativeElement.click();


      fixture.detectChanges();
      fixture.whenStable().then(() => {

        itemDebugElement.nativeElement.click()
        fixture.detectChanges();

        expect(popoverComponentInstance.hide)
            .toHaveBeenCalled();
        expect(popoverComponentInstance.isVisible)
            .toEqual(false, 'isVisible is not false');

        expect(popoverNativeElement.classList.contains('is-visible'))
            .toBe(false, 'did has css class is-visible');

      });


    }));


    it('should toggle popover on button click', async(() => {

      let popoverComponent = fixture.debugElement.query(By.css('.mdl-popover'))

      let popoverNativeElement = popoverComponent.nativeElement;

      let buttonNativeElement = fixture.debugElement.query(By.css('.mdl-button')).nativeElement;

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

  describe('item tooltips', () => {


    it('should not display tooltips after click on the FAB', async(() => {

      let buttonComponent = fixture.debugElement.query(By.css('.mdl-button'))

      let tooltipNotAlwaysElement: HTMLElement = fixture.debugElement.query(By.css('#itemNotAlwaysTooltip > mdl-chip')).nativeElement
      //let el: HTMLElement = fixture.debugElement.query(By.directive(MdlChipComponent)).nativeElement;

      buttonComponent.nativeElement.click();

      fixture.detectChanges();
      fixture.whenStable().then(() => {

        expect(tooltipNotAlwaysElement.hidden).toBe(true);

      });


    }));

    it('should display tooltips on rollover', async(() => {

      let buttonComponent = fixture.debugElement.query(By.css('.mdl-button'))

      let tooltipNotAlwaysDebugElement: DebugElement = fixture.debugElement.query(By.css('#itemNotAlwaysTooltip > mdl-chip'))

      let tooltipNotAlwaysElement: HTMLElement = tooltipNotAlwaysDebugElement.nativeElement

      let itemDebugElement: HTMLElement = fixture.debugElement.query(By.css('#itemNotAlwaysTooltip > .mdl-button')).nativeElement

      buttonComponent.nativeElement.click();


      fixture.detectChanges();
      fixture.whenStable().then(() => {

        const eventover = new Event('mouseover')
        itemDebugElement.dispatchEvent(eventover)
        fixture.detectChanges()
        expect(tooltipNotAlwaysElement.hidden).toBe(false);
        const eventleave = new Event('mouseleave')
        itemDebugElement.dispatchEvent(eventleave)
        fixture.detectChanges()
        expect(tooltipNotAlwaysElement.hidden).toBe(true);

      });


    }));

    it('should display tooltips after click on the FAB', async(() => {

      let buttonComponent = fixture.debugElement.query(By.css('.mdl-button'))

      let tooltipAlwaysElement: HTMLElement = fixture.debugElement.query(By.css('#itemAlwaysTooltip > mdl-chip')).nativeElement

      buttonComponent.nativeElement.click();

      fixture.detectChanges();
      fixture.whenStable().then(() => {

        expect(tooltipAlwaysElement.hidden).toBe(false);

      });


    }));

    it('should display tooltips after touch start on the FAB', async(() => {

      let buttonElement = fixture.debugElement.query(By.css('.mdl-button')).nativeElement

      let tooltipAlwaysElement: HTMLElement = fixture.debugElement.query(By.css('#itemNotAlwaysTooltip > mdl-chip')).nativeElement

      const touchevent = new Event('touchstart')
      buttonElement.dispatchEvent(touchevent)
      fixture.detectChanges()
      buttonElement.click();

      fixture.detectChanges();
      fixture.whenStable().then(() => {

        expect(tooltipAlwaysElement.hidden).toBe(false);

      });


    }));

  });


});


@Component({
  template: `
      <mdl-fab-menu #mainFabMenu>
          <mdl-fab-menu-item id="itemNotAlwaysTooltip"
                             [fabMenu]="mainFabMenu"
                             icon="note_add"
                             label="make a note"
                             (menu-clicked)="logMessage('use want to make a note')">
          </mdl-fab-menu-item>
          <mdl-fab-menu-item
                  [fabMenu]="mainFabMenu"
                  icon="refresh"
                  label="refresh"
                  (menu-clicked)="logMessage('user elected to refresh!')">
          </mdl-fab-menu-item>
      </mdl-fab-menu>
      <mdl-fab-menu #mainFabMenu2 [alwaysShowTooltips]="true">
          <mdl-fab-menu-item id="itemAlwaysTooltip"
                             [fabMenu]="mainFabMenu2"
                             icon="note_add"
                             label="make a note"
                             (menu-clicked)="logMessage('use want to make a note')">
          </mdl-fab-menu-item>
          <mdl-fab-menu-item
                  [fabMenu]="mainFabMenu2"
                  icon="refresh"
                  label="refresh"
                  (menu-clicked)="logMessage('user elected to refresh!')">
          </mdl-fab-menu-item>
      </mdl-fab-menu>
  `
})
class TestMdlFabMenuComponent {
  logMessage (msg: string) {
    console.log(msg)
  }
}
