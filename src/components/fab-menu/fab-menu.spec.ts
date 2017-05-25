import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdlFabMenuComponent } from './fab-menu';
import { CommonModule } from '@angular/common';
import { MdlPopoverModule } from '../popover/popover';
import { MdlIconModule } from '@angular-mdl/core';


describe('MdlFabMenuComponent', () => {


    let fixture: ComponentFixture<MdlFabMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MdlPopoverModule,
                MdlIconModule
            ],
            declarations: [MdlFabMenuComponent],
            providers: [
            ]
        });

        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(MdlFabMenuComponent);
            fixture.detectChanges();
        });
    }));

    it('should instantiate the component', async(() => {
        expect(fixture).toBeDefined();
    }));
});