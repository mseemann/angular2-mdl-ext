import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MdlFabMenuComponent, MdlFabMenuModule} from './fab-menu';
import { CommonModule } from '@angular/common';
import {MdlPopoverModule, MdlPopoverComponent} from '../popover/popover';
import {MdlIconModule, MdlModule} from '@angular-mdl/core';
import {Component, DebugElement, ComponentRef} from '@angular/core'
import {MdlFabMenuItemComponent} from './fab-menu-item'
import {By} from '@angular/platform-browser'


describe('MdlFabMenuComponent', () => {


    let fixture: ComponentFixture<MdlFabMenuComponent>;

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

    afterEach(()=>{fixture=null})

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

@Component({
    template: `
    <mdl-fab-menu #mainFabMenu>
        <mdl-fab-menu-item
                [fabMenu]="mainFabMenu"
                icon="note_add"
                label="make a note"
                (menu-clicked)="alert('we need to do something here')">
        </mdl-fab-menu-item>
        <mdl-fab-menu-item
                [fabMenu]="mainFabMenu"
                icon="refresh"
                label="refresh"
                (menu-clicked)="alert('user elected to refresh!')">
        </mdl-fab-menu-item>
    </mdl-fab-menu>  
    <mdl-fab-menu #mainFabMenu2 [alwaysShowTooltips]="true">
        <mdl-fab-menu-item
                [fabMenu]="mainFabMenu2"
                icon="note_add"
                label="make a note"
                (menu-clicked)="alert('we need to do something here')">
        </mdl-fab-menu-item>
        <mdl-fab-menu-item
                [fabMenu]="mainFabMenu2"
                icon="refresh"
                label="refresh"
                (menu-clicked)="alert('user elected to refresh!')">
        </mdl-fab-menu-item>
    </mdl-fab-menu>  
    `
})
class TestMdlFabMenuComponent {}
