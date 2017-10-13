import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {Component, DebugElement, ViewChild} from '@angular/core'
import { MdlVirtualTableComponent, MdlVirtualTableModule, MdlVirtualTableColumnComponent } from './';
import { VirtualScrollModule, VirtualScrollComponent } from 'angular2-virtual-scroll';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

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
            declarations: [TestMdlVirtualTableComponent,
                TestMdlVirtualTableComponentWithAutoInit,
                TestMdlVirtualTableComponentWithoutRowCountRequest,
                TestMdlVirtualTableComponentWithoutRowDataRequest],
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

    it('should sort columns with sortable attribute', async(() => {
        let testInstance = fixture.componentInstance;
        let debugTableInstance = fixture.debugElement.query(By.directive(MdlVirtualTableComponent));
        let componentInstance: MdlVirtualTableComponent = debugTableInstance.
            componentInstance;

            testInstance.initData(rows);
            fixture.autoDetectChanges();
            fixture.whenStable().then(() => {
                
                let sortSpy = spyOn(testInstance, 'onSort').and.callThrough();
    
                let columnElements = debugTableInstance.nativeElement.querySelectorAll("div.table-header div.header-cell");
                columnElements[0].click();
                expect(testInstance.onSort).toHaveBeenCalledWith({column: '_index', direction: 'asc'});
                sortSpy.calls.reset();
                columnElements[0].click();
                expect(testInstance.onSort).toHaveBeenCalledWith({column: '_index', direction: 'desc'});
            });
    }));

    it('should not sort columns without sortable attribute', async(() => {
        let testInstance = fixture.componentInstance;
        let debugTableInstance = fixture.debugElement.query(By.directive(MdlVirtualTableComponent));
        let componentInstance: MdlVirtualTableComponent = debugTableInstance.
            componentInstance;

            testInstance.initData(rows);
            fixture.autoDetectChanges();
            fixture.whenStable().then(() => {
                
                spyOn(testInstance, 'onSort').and.callThrough();
    
                let columnElements = debugTableInstance.nativeElement.querySelectorAll("div.table-header div.header-cell");
                columnElements[1].click();
                expect(testInstance.onSort).not.toHaveBeenCalled();
            });
    }));

    it('should emit event on click on a row', async(() => {
        let testInstance = fixture.componentInstance;
        let debugTableInstance = fixture.debugElement.query(By.directive(MdlVirtualTableComponent));
        let componentInstance: MdlVirtualTableComponent = debugTableInstance.
            componentInstance;

            testInstance.initData(rows);
            fixture.autoDetectChanges();
            fixture.whenStable().then(() => {
                
                spyOn(testInstance, 'onRowClick').and.callThrough();
    
                let visibleRows = debugTableInstance.nativeElement.querySelectorAll("div.table div.table-row");
                visibleRows[0].click();
                expect(testInstance.onRowClick).toHaveBeenCalled();
            });
    }));

    it('should throw error on missing rowCountRequest listener', async(() => {
        TestBed.compileComponents().then(() => {
            let fixtureWrongConfig: ComponentFixture<TestMdlVirtualTableComponentWithoutRowCountRequest> = TestBed.createComponent(TestMdlVirtualTableComponentWithoutRowCountRequest);
            fixtureWrongConfig.detectChanges();
            expect(() => fixtureWrongConfig.componentInstance.refresh()).toThrowError('mdl-virtual-table component has no rowCountRequest Listener');
        });
        
    }));

    it('should throw error on missing rowDataRequest listener', async(() => {
        TestBed.compileComponents().then(() => {
            let fixtureTest: ComponentFixture<TestMdlVirtualTableComponentWithoutRowDataRequest> = TestBed.createComponent(TestMdlVirtualTableComponentWithoutRowDataRequest);
            fixtureTest.detectChanges(); 
            expect(() => fixtureTest.componentInstance.refresh()).toThrowError('mdl-virtual-table component has no rowDataRequest Listener');
        });
    }));


    it('should load with auto initial load data', fakeAsync(() => {
        let fixtureAutoInit: ComponentFixture<TestMdlVirtualTableComponentWithAutoInit>;
        TestBed.compileComponents().then(() => {
            fixtureAutoInit = TestBed.createComponent(TestMdlVirtualTableComponentWithAutoInit);

        });
        tick();
        let debugComponent = fixtureAutoInit.debugElement.query(By.directive(MdlVirtualTableComponent));
        expect(fixtureAutoInit).toBeDefined();
        fixtureAutoInit.componentInstance.initData(rows);
        fixtureAutoInit.autoDetectChanges();
        fixtureAutoInit.whenStable().then(() => {
            expect(debugComponent.componentInstance.values.length).toBe(rows.length, 'Rows length should be 1000');
        });
        tick();
    }));

    it('should refresh data if table becomes visible', (done) => {
        let testInstance = fixture.componentInstance;

        let debugComponent = fixture.debugElement.query(By.directive(MdlVirtualTableComponent));
        let componentInstance:MdlVirtualTableComponent = debugComponent.componentInstance;
        let debugVirtualScroll = fixture.debugElement.query(By.directive(VirtualScrollComponent));

        testInstance.hideTable();
        testInstance.initData(rows);
        fixture.autoDetectChanges();
        fixture.whenStable().then(() => {

            spyOn(debugVirtualScroll.componentInstance, 'refresh');

            testInstance.showTable();
            fixture.detectChanges();
            setTimeout(() => {
                expect(debugVirtualScroll.componentInstance.refresh).toHaveBeenCalled();
                done();
            }, 10); // IntersectionObserver delay
        });
    });

    it('should refresh table on refresh call', async(() => {
        let testInstance = fixture.componentInstance;
        let debugTableInstance = fixture.debugElement.query(By.directive(MdlVirtualTableComponent));
        let componentInstance: MdlVirtualTableComponent = debugTableInstance.
            componentInstance;

        testInstance.initData(rows);
        fixture.autoDetectChanges();
        fixture.whenStable().then(() => {
            
            spyOn(testInstance, 'onRowDataRequest').and.callThrough();
            componentInstance.refresh();
            expect(testInstance.onRowDataRequest).toHaveBeenCalled();
        });
    }));
    
    
});

@Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" maxHeight="500px" 
    init-refresh-disabled [style.display]="visible ? 'block' : 'none'" 
    [rowDataStream]="rowDataStream" [rowCountStream]="rowCountStream" 
    (rowCountRequest)="onRowCountRequest()" (rowDataRequest)="onRowDataRequest($event)"
    (sort)="onSort($event)" (rowClick)="onRowClick($event)">
      <mdl-column label="Index" sortable field="_index" width="1%"></mdl-column>
      <mdl-column label="Description" field="_label" width="1%">
        <ng-template let-value><div style="text-align: right;">Title: {{value}}</div></ng-template>
      </mdl-column>
    </mdl-virtual-table>
    </div>
    `
  })
  class TestMdlVirtualTableComponent {

    @ViewChild('table') table: MdlVirtualTableComponent;
    
    protected rows: any[];
    
    public visible: boolean = true;    
    
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

    hideTable() {
        this.visible = false;
    }

    showTable() {
        this.visible = true;
    } 
  }

  @Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" maxHeight="500px" 
    init-refresh-disabled (rowDataRequest)="onRowDataRequest($event)"
    [rowDataStream]="rowDataStream" [rowCountStream]="rowCountStream">
      <mdl-column label="Index" sortable field="_index" width="1%"></mdl-column>
      <mdl-column label="Description" field="_label" width="1%">
        <ng-template let-value><div style="text-align: right;">Title: {{value}}</div></ng-template>
      </mdl-column>
    </mdl-virtual-table>
    </div>
    `
  })
  class TestMdlVirtualTableComponentWithoutRowCountRequest extends TestMdlVirtualTableComponent {

    refresh() {
        this.table.refresh();
    }
  }

@Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" maxHeight="500px" 
    init-refresh-disabled (rowCountRequest)="onRowCountRequest()" 
    [rowDataStream]="rowDataStream" [rowCountStream]="rowCountStream" 
    (sort)="onSort($event)" (rowClick)="onRowClick($event)">
        <mdl-column label="Index" sortable field="_index" width="1%"></mdl-column>
        <mdl-column label="Description" field="_label" width="1%">
        <ng-template let-value><div style="text-align: right;">Title: {{value}}</div></ng-template>
        </mdl-column>
    </mdl-virtual-table>
    </div>
    `
})
class TestMdlVirtualTableComponentWithoutRowDataRequest extends TestMdlVirtualTableComponent {
    refresh() {
        this.table.refresh();
    }
}

@Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" maxHeight="500px"
    [rowDataStream]="rowDataStream" [rowCountStream]="rowCountStream"
    intersection-observer-disabled 
    (rowCountRequest)="onRowCountRequest()" (rowDataRequest)="onRowDataRequest($event)">
        <mdl-column label="Index" sortable field="_index" width="1%"></mdl-column>
        <mdl-column label="Description" field="_label" width="1%">
        <ng-template let-value><div style="text-align: right;">Title: {{value}}</div></ng-template>
        </mdl-column>
    </mdl-virtual-table>
    </div>
`
})
  class TestMdlVirtualTableComponentWithAutoInit extends TestMdlVirtualTableComponent {

  } 