import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdlVirtualTableComponent } from './table.component';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

describe('VirtualTableComponent', () => {


    let fixture: ComponentFixture<MdlVirtualTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                VirtualScrollModule
            ],
            declarations: [MdlVirtualTableComponent],
            providers: [
            ]
        });

        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(MdlVirtualTableComponent);
            fixture.detectChanges();
        });
    }));

    it('should instantiate the component', async(() => {
        expect(fixture).toBeDefined();
    }));
});