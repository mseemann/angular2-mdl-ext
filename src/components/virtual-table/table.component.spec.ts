import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, ViewChild } from '@angular/core'
import { MdlVirtualTableComponent, MdlVirtualTableModule, MdlVirtualTableColumnComponent, RowDataResponseInterface } from './';
import { VirtualScrollModule, VirtualScrollComponent } from 'angular2-virtual-scroll';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

/// <reference types="karma-viewport" />

describe('VirtualTableComponent', () => {


    let fixture: ComponentFixture<TestMdlVirtualTableComponent>;

    //generate rows
    let rows: any[] = [];
    for (var i = 0; i < 1000; i++) {
        rows.push({ _index: i, _label: 'Test ' + i });
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MdlVirtualTableModule.forRoot()
            ],
            declarations: [TestMdlVirtualTableComponent,
                TestMdlVirtualTableComponentWithAutoInit,
                TestMdlVirtualTableComponentWithoutRowCountRequest,
                TestMdlVirtualTableComponentWithoutRowDataRequest,
                TestMdlVirtualTableComponentWithRowSelection,
                TestMdlVirtualTableComponentWithRowSelectionAll,    
                TestMdlVirtualTableComponentWithResponsiveList
            ],
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

        let componentInstance: MdlVirtualTableComponent = fixture.debugElement.query(By.directive(MdlVirtualTableComponent)).componentInstance;
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
            }, 120); //wait for requestAnimationFrame
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
            expect(testInstance.onSort).toHaveBeenCalledWith({ column: '_index', direction: 'asc' });
            sortSpy.calls.reset();
            columnElements[0].click();
            expect(testInstance.onSort).toHaveBeenCalledWith({ column: '_index', direction: 'desc' });
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
        let componentInstance: MdlVirtualTableComponent = debugComponent.componentInstance;
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


    it('should be able to select single row and all rows', ((done) => {
        fixture.destroy();
        let fixtureSelection: ComponentFixture<TestMdlVirtualTableComponentWithRowSelectionAll>;
        TestBed.compileComponents().then(() => {
            fixtureSelection = TestBed.createComponent(TestMdlVirtualTableComponentWithRowSelectionAll);
            fixtureSelection.detectChanges();

            expect(fixtureSelection).toBeDefined();

            let testInstance = fixtureSelection.componentInstance;
            let debugTableInstance = fixtureSelection.debugElement.query(By.directive(MdlVirtualTableComponent));
            let componentInstance: MdlVirtualTableComponent = debugTableInstance.
                componentInstance;

            let debugVirtualScroll = fixtureSelection.debugElement.query(By.directive(VirtualScrollComponent));
            let componentVirtualScroll: VirtualScrollComponent = debugVirtualScroll.componentInstance;

            testInstance.initData(rows.slice(0, 100));
            fixtureSelection.autoDetectChanges();
            fixtureSelection.whenStable().then(() => {

                let spyOnRowSelection = spyOn(testInstance, 'onRowSelection').and.callThrough();
                let selectionCheckbox = debugTableInstance.nativeElement.querySelector("div.table div.table-row:first-child + .table-row .mdl-checkbox");
                selectionCheckbox.click();
                
                expect(testInstance.onRowSelection).toHaveBeenCalled();
                expect(componentInstance.selection).toEqual(['1']);
                
                selectionCheckbox = debugTableInstance.nativeElement.querySelector("div.table div.table-row:first-child + .table-row .mdl-checkbox");
                selectionCheckbox.click();
                expect(spyOnRowSelection.calls.count()).toBe(2);
                expect(componentInstance.selection).toEqual([]);

                spyOnRowSelection.calls.reset();
                componentInstance.onChangeRowSelection(undefined, '1');
                expect(testInstance.onRowSelection).not.toHaveBeenCalled();
                
                let selectAllCheckbox = debugTableInstance.nativeElement.querySelector("div.table-header div.table-row .header-cell .mdl-checkbox");
                selectAllCheckbox.click();

                var scrollElement = componentVirtualScroll.parentScroll instanceof Window ? document.body : componentVirtualScroll.parentScroll || debugVirtualScroll.nativeElement;
                var fixedRowHeight = 48; //@see table.component.scss
                var scrollIndex = 30;
                scrollElement.scrollTop = (fixedRowHeight + 1) * scrollIndex;
                componentVirtualScroll.refresh();
                
                setTimeout(() => {
                    //scroll down
                    scrollIndex += 30;
                    scrollElement.scrollTop = (fixedRowHeight + 1) * scrollIndex;
                    componentVirtualScroll.refresh();

                    setTimeout(() => {
                        scrollIndex += 30;
                        scrollElement.scrollTop = (fixedRowHeight + 1) * scrollIndex;
                        componentVirtualScroll.refresh();
                        setTimeout(() => {
                            // selection should contain all row ids + __all__ element
                            expect(componentInstance.selection.length).toBe(componentInstance.values.length+1, "Could not select all visible rows!");

                            selectionCheckbox = debugTableInstance.nativeElement.querySelector("div.table div.table-row:first-child + .table-row .mdl-checkbox");
                            selectionCheckbox.click();

                            expect(componentInstance.selection).toContain('__all__');
                            expect(componentInstance.rejection).toContain('80');

                            selectionCheckbox = debugTableInstance.nativeElement.querySelector("div.table div.table-row:first-child + .table-row + .table-row .mdl-checkbox");
                            selectionCheckbox.click();

                            expect(componentInstance.rejection.length).toBe(2);

                            selectionCheckbox = debugTableInstance.nativeElement.querySelector("div.table div.table-row:first-child + .table-row .mdl-checkbox");
                            selectionCheckbox.click();

                            selectAllCheckbox.click(); //select all
                            selectAllCheckbox.click(); //unselect all
                            expect(componentInstance.selection.length).toBe(0, "Could not unselect all visible rows!");
                            done();
                        }, 120);

                    }, 120); //wait for requestAnimationFrame
                }, 120); //wait for requestAnimationFrame

            });


        });

    }));

    it('should select single row without all option', ((done) => {
        let fixtureSelection: ComponentFixture<TestMdlVirtualTableComponentWithRowSelection>;
        TestBed.compileComponents().then(() => {
            fixtureSelection = TestBed.createComponent(TestMdlVirtualTableComponentWithRowSelection);
            fixtureSelection.detectChanges();

            expect(fixtureSelection).toBeDefined();

            let testInstance = fixtureSelection.componentInstance;
            let debugTableInstance = fixtureSelection.debugElement.query(By.directive(MdlVirtualTableComponent));
            let componentInstance: MdlVirtualTableComponent = debugTableInstance.
                componentInstance;

            testInstance.initData(rows.slice(0, 100));
            fixtureSelection.autoDetectChanges();
            fixtureSelection.whenStable().then(() => {
                let spyOnRowSelection = spyOn(testInstance, 'onRowSelection').and.callThrough();
                let selectionCheckbox = debugTableInstance.nativeElement.querySelector("div.table div.table-row:first-child + .table-row .mdl-checkbox");
                selectionCheckbox.click();
                
                expect(testInstance.onRowSelection).toHaveBeenCalled();
                expect(componentInstance.selection).toEqual(['1']);
                done();
            });
        });
    }));

    it('should show list instead of table if window size reaches the breakpoint', async(() => {
        viewport.set("mobile");
        let fixtureList: ComponentFixture<TestMdlVirtualTableComponentWithResponsiveList>;
        TestBed.compileComponents().then(() => {
            fixtureList = TestBed.createComponent(TestMdlVirtualTableComponentWithResponsiveList);
            let debugComponent = fixtureList.debugElement.query(By.directive(MdlVirtualTableComponent));
            expect(fixtureList).toBeDefined();
            fixtureList.componentInstance.initData(rows);

            let testInstance = fixtureList.componentInstance;
            let debugTableInstance = fixtureList.debugElement.query(By.directive(MdlVirtualTableComponent));
            let componentInstance: MdlVirtualTableComponent = debugTableInstance.
                componentInstance;

            testInstance.initData(rows);
            fixtureList.autoDetectChanges();

            fixtureList.whenStable().then(() => {
                expect(debugTableInstance.nativeElement.querySelector(".list")).not.toBe(null);
                let listItemClickSpy = spyOn(testInstance, 'onListItemClick').and.callThrough();
                let listElements = debugTableInstance.nativeElement.querySelectorAll("div.list div.list-item");
                listElements[1].click();
                expect(testInstance.onListItemClick).toHaveBeenCalledWith(jasmine.objectContaining({ row: rows[1], index: 1 }));
            });
        });
    }));
});

@Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" max-height="500px" 
    init-refresh-disabled [style.display]="visible ? 'block' : 'none'" 
    [row-data-stream]="rowDataStream" [row-count-stream]="rowCountStream" 
    (row-count-request)="onRowCountRequest()" (row-data-request)="onRowDataRequest($event)"
    (sort)="onSort($event)" (row-click)="onRowClick($event)">
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
    public rowDataStream: Observable<{ rows: any[], offset: number, limit: number }>;

    onSort(data: { column: string, direction: string }) {
    }

    onRowClick(event: any) {
    }

    requestRowCount() {
        return Observable.of(this.rows.length || 1000);
    }

    onRowCountRequest() {
        this.rowCountStream = this.requestRowCount();
    }

    onRowDataRequest(request: { offset: number, limit: number, refresh?: boolean }) {
        this.rowDataStream = this.requestRowData(request.offset, request.limit);
    }

    requestRowData(offset: number, limit: number): Observable<RowDataResponseInterface> {
        if (!this.rows) {
            return Observable.of({ rows: [], offset: 0, limit: 0 });
        }
        let items = this.rows.slice(offset, offset + limit);
        return Observable.of({ rows: items, offset, limit });
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
    <mdl-virtual-table #table flex-height mdl-shadow="2" max-height="500px" 
    init-refresh-disabled (row-data-request)="onRowDataRequest($event)"
    [row-data-stream]="rowDataStream" [row-count-stream]="rowCountStream">
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
    <mdl-virtual-table #table flex-height mdl-shadow="2" max-height="500px" 
    init-refresh-disabled (row-count-request)="onRowCountRequest()" 
    [row-data-stream]="rowDataStream" [row-count-stream]="rowCountStream" 
    (sort)="onSort($event)" (row-click)="onRowClick($event)">
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
    <mdl-virtual-table #table flex-height mdl-shadow="2" max-height="500px"
    [row-data-stream]="rowDataStream" [row-count-stream]="rowCountStream"
    intersection-observer-disabled 
    (row-count-request)="onRowCountRequest()" (row-data-request)="onRowDataRequest($event)">
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


@Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" max-height="500px"
    [row-data-stream]="rowDataStream" [row-count-stream]="rowCountStream"
    intersection-observer-disabled init-refresh-disabled 
    (row-count-request)="onRowCountRequest()" (row-data-request)="onRowDataRequest($event)">
        <mdl-column label="Index" sortable field="_index" width="1%"></mdl-column>
        <mdl-column label="Description" field="_label" width="1%">
        <ng-template let-value><div style="text-align: right;">Title: {{value}}</div></ng-template>
        </mdl-column>
        <mdl-virtual-table-list (item-click)="onListItemClick($event)" item-height="51" breakpoint-max-width="480">
        <ng-template let-row>
          <strong>Index: {{row?._index}}</strong><br>
          My Label: {{row?._label}}
        </ng-template>
      </mdl-virtual-table-list>
    </mdl-virtual-table>
    </div>
`
})
class TestMdlVirtualTableComponentWithResponsiveList extends TestMdlVirtualTableComponent {

    onListItemClick(data: { event: MouseEvent, row: any, index: number }) {

    }
}

@Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" max-height="500px"
    [row-data-stream]="rowDataStream" [row-count-stream]="rowCountStream"
    init-refresh-disabled 
    intersection-observer-disabled (row-selection-change)="onRowSelection($event)"
    (row-count-request)="onRowCountRequest()" (row-data-request)="onRowDataRequest($event)">
        <mdl-column select-all-enabled row-selection-enabled field="_index"></mdl-column>
        <mdl-column label="Index" sortable field="_index" width="1%"></mdl-column>
        <mdl-column label="Description" field="_label" width="1%">
        <ng-template let-value><div style="text-align: right;">Title: {{value}}</div></ng-template>
        </mdl-column>
    </mdl-virtual-table>
    </div>
`
})
class TestMdlVirtualTableComponentWithRowSelectionAll extends TestMdlVirtualTableComponent {
    onRowSelection(event: number[]) {

    }
} 

@Component({
    template: `
    <div style="display: flex; flex-direction: column; max-height: 100vh">
    <mdl-virtual-table #table flex-height mdl-shadow="2" max-height="500px"
    [row-data-stream]="rowDataStream" [row-count-stream]="rowCountStream"
    init-refresh-disabled 
    intersection-observer-disabled (row-selection-change)="onRowSelection($event)"
    (row-count-request)="onRowCountRequest()" (row-data-request)="onRowDataRequest($event)">
        <mdl-column row-selection-enabled field="_index"></mdl-column>
        <mdl-column label="Index" sortable field="_index" width="1%"></mdl-column>
        <mdl-column label="Description" field="_label" width="1%">
        <ng-template let-value><div style="text-align: right;">Title: {{value}}</div></ng-template>
        </mdl-column>
    </mdl-virtual-table>
    </div>
`
})
class TestMdlVirtualTableComponentWithRowSelection extends TestMdlVirtualTableComponent {
    onRowSelection(event: number[]) {

    }
} 