import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {Component, DebugElement, ViewChild} from '@angular/core'
import { MdlVirtualTableComponent, MdlVirtualTableModule } from './';
import { VirtualScrollModule, VirtualScrollComponent } from 'angular2-virtual-scroll';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;

describe('VirtualTableComponent', () => {


    let fixture: ComponentFixture<TestMdlVirtualTableComponent>;

    //generate rows
    let rows:any[] = [];
    for(var i = 0; i < 1000; i++) {
        rows.push({_index: i, _label: 'Test ' + i});
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MdlVirtualTableModule.forRoot()
            ],
            declarations: [TestMdlVirtualTableComponent],
            providers: [
            ]
        });

        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TestMdlVirtualTableComponent);
            fixture.detectChanges();
        });
    }));

    afterEach(() => {
        fixture = null
    });

    it('should instantiate the component', async(() => {
        expect(fixture).toBeDefined();
    }));

    it('should load row count', async(() => {
        let testInstance = fixture.componentInstance;
        let debugComponent = fixture.debugElement.query(By.directive(MdlVirtualTableComponent));

        testInstance.initData(rows);
        fixture.autoDetectChanges();
        fixture.whenStable().then(() => {
            expect(debugComponent.componentInstance.values.length).toBe(rows.length, 'Rows length should be 1000');
        });
        
    }));

    it('should load viewport rows', ((done) => {
        let testInstance = fixture.componentInstance;
        
        let componentInstance:MdlVirtualTableComponent = fixture.debugElement.query(By.directive(MdlVirtualTableComponent)).componentInstance;
        let debugVirtualScroll = fixture.debugElement.query(By.directive(VirtualScrollComponent));
        let componentVirtualScroll: VirtualScrollComponent = debugVirtualScroll.componentInstance;

        testInstance.initData(rows);
        fixture.autoDetectChanges();
        fixture.whenStable().then(() => {
            //simulate scroll
            var scrollElement = componentVirtualScroll.parentScroll instanceof Window ? document.body : componentVirtualScroll.parentScroll || debugVirtualScroll.nativeElement;            
            var fixedRowHeight = 48; //@see table.component.scss
            var scrollIndex = 500;
            scrollElement.scrollTop = (fixedRowHeight + 1) * scrollIndex;
            componentVirtualScroll.refresh();
            setTimeout(() => {
                expect(componentInstance.values[500]).toBe(rows[500], 'Row index 500 should be loaded');
                done();
            }, 20); //wait for requestAnimationFrame
        });
    }));
    
    
});

@Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" maxHeight="500px" 
    init-refresh-disabled
    [rowDataStream]="rowDataStream" [rowCountStream]="rowCountStream" 
    (rowCountRequest)="onRowCountRequest()" (rowDataRequest)="onRowDataRequest($event)"
    (sort)="onSort($event)" (rowClick)="onRowClick($event)">
      <mdl-column label="Index" sortable="true" field="_index" width="1%"></mdl-column>
      <mdl-column label="Description" field="_label" width="1%">
        <ng-template let-value><div style="text-align: right;">Title: {{value}}</div></ng-template>
      </mdl-column>
    </mdl-virtual-table>
    </div>
    `
  })
  class TestMdlVirtualTableComponent {

    @ViewChild('table') table: MdlVirtualTableComponent;

    private rows: any[];

    public rowCountStream: Observable<number>;
    public rowDataStream: Observable<{rows: any[], offset: number, limit: number}>;

    onSort(data: {column: string, direction: string}) {
        console.log("sort data:", data);
    }

    onRowClick(event: any) {
        console.log("on row click", event);
    }

    requestRowCount() {
        return Observable.of(1000);
    }

    onRowCountRequest() {
        this.rowCountStream = this.requestRowCount();
    }

    onRowDataRequest(request: {offset: number, limit: number, refresh?:boolean}) {
        this.rowDataStream = this.requestRowData(request.offset, request.limit);
    }

    requestRowData(offset: number, limit: number) {
        if(!this.rows) {
            return Observable.of({rows: [], offset: 0, limit: 0});
        }
        let items = this.rows.slice(offset, offset + limit);
        return Observable.of({rows: items, offset, limit});
    }

    initData(rows: any[]) {
        this.rows = rows;
        this.table.refresh(true);
    }
  }