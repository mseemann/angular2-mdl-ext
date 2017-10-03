import {
    Component,
    Input,
    Output,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ViewChild,
    ContentChildren,
    EventEmitter,
    OnInit,
    OnChanges,
    OnDestroy,
    AfterViewChecked,
    SimpleChanges,
    HostBinding,
    QueryList,
    ElementRef
} from '@angular/core';
import {VirtualScrollComponent, ChangeEvent} from 'angular2-virtual-scroll';
import {MdlVirtualTableColumnComponent} from './column.component';
import {Observable, Subject} from 'rxjs';
import 'rxjs/add/operator/withLatestFrom';

declare var IntersectionObserver: any;

@Component({
    selector: 'mdl-virtual-table',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
  <div #tableWrapper class="table-container mdl-data-table mdl-js-data-table mdl-data-table--selectable" [class.flex-height]="isFlexHeight">
	<div class="scrollbar-space">
	  <div class="table-header">
	   <div class="table-row">
		  <div class="header-cell" *ngFor="let col of columns" [style.width]="col.width ? col.width : '1%'"
			[class.sortable]="col.sortable" [class.asc]="col.sortDirection === 'asc'" [class.desc]="col.sortDirection === 'desc'" (click)="toggleSortByColumn(col)">
			{{col.label}}</div>
		</div>
		</div>
    </div>
    <virtual-scroll #scroll [bufferAmount]="10" (update)="rows = $event" [style.maxHeight]="maxHeight" 
    [style.minHeight]="minHeight" [items]="values" (change)="onListChange($event)" 
    (start)="onListChange($event)" 
    (end)="onListChange($event)">
      <div #container class="table">
           <div class="table-row" *ngFor="let row of rows; let i = index" (click)="onRowClick($event, row, _visibleRowOffset + i)">
            <div class="table-cell" *ngFor="let col of columns" [style.width]="col.width ? col.width : '1%'">
              <ng-container *ngTemplateOutlet="col.cellTemplate ? col.cellTemplate : defaultCellTemplate; context: {$implicit: row ? row[col.field] : '', row: row}"></ng-container>
            </div>
          </div>
      </div>
    </virtual-scroll>
    <ng-template #defaultCellTemplate let-value><span>{{value}}</span></ng-template>
    </div>
  `,
    styleUrls: ['table.component.scss']
})
export class MdlVirtualTableComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    values: any[];

    @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;
    
    @ViewChild('tableWrapper') 
    private virutalScrollElement: ElementRef;

    @ContentChildren(MdlVirtualTableColumnComponent)
    columns: QueryList<MdlVirtualTableColumnComponent>;
    private lastLoadedElementHash: string;

    @Input() rowCountStream: Observable<number>;
    @Input() rowDataStream: Observable<{rows: any[], offset: number, limit: number}>;

    @Input() maxHeight: string = '100vh';
    @Input() minHeight: string;

    private _isFlexHeight: boolean = false;
    @HostBinding('class.flex-height')
    @Input('flex-height')
    get isFlexHeight() {
        return this._isFlexHeight;
    }

    set isFlexHeight(value) {
        this._isFlexHeight = value != null && "" + value !== 'false';
    }

    private _rowCount: number;
    private _visibleRowOffset: number;
    private _nativeElementObserver: any;

    @Output() sort: EventEmitter<any>;
    @Output() rowClick: EventEmitter<any>;
    
    private requestRowCountSubject: Subject<any>;
    private requestRowDataSubject: Subject<any>;
    
    @Output() rowCountRequest: EventEmitter<any>;
    @Output() rowDataRequest: EventEmitter<{offset: number, limit: number}>;

    rows: any[];

    constructor(private cdr: ChangeDetectorRef) {
      this.sort = new EventEmitter<any>();
      this.rowClick = new EventEmitter<any>();
      this.rowCountRequest = new EventEmitter();
      this.rowDataRequest = new EventEmitter();
      this.requestRowCountSubject = new Subject<any>();
      this.requestRowDataSubject = new Subject<any>();
		  this.requestRowCountSubject.asObservable().subscribe(() => {
        this.rowCountRequest.emit();
      });
		  this.requestRowDataSubject.asObservable().distinctUntilChanged((x: any, y: any) => {
			  return (x.offset === y.offset && x.limit === y.limit) && !x.refresh && !y.refresh;
		  }).subscribe((result) => {
        this.rowDataRequest.emit(result);
      });
    }

    ngOnInit() {		
        this.refresh(true);
    }
    
    ngAfterViewChecked() {    	
    	if(!this._nativeElementObserver && this.virutalScrollElement.nativeElement) {
        this._nativeElementObserver = new IntersectionObserver((entries: any[]) => {
        
          if(!(entries.shift().intersectionRatio > 0)) {
            return;
          }
          if(this.virtualScroll.startupLoop) {
            return;
          }
          this.virtualScroll.startupLoop = true;
          this.virtualScroll.refresh();
          
        }, {
          rootMargin: '0px',
          threshold: 1.0
        });
        
        this._nativeElementObserver.observe(this.virutalScrollElement.nativeElement);
      }
    }
    
    ngOnDestroy() {
      if(this._nativeElementObserver) {
        this._nativeElementObserver.disconnect();
      }
    }
    
    ngOnChanges(changes: SimpleChanges) {
		    if((<any>changes).rowDataStream && (<any>changes).rowDataStream.currentValue) {
          let lastRowDataSubscription = this.rowDataStream.subscribe((result) => {
            this._visibleRowOffset = result.offset;
            this._rowCount = this._rowCount || result.rows.length;
            let values = new Array(this._rowCount);
            for (var i = result.offset; i < (result.rows.length + result.offset); i++) {
              values[i] = result.rows[i - result.offset];
            }
            this.values = values;
            this.virtualScroll.previousStart = undefined;
            this.virtualScroll.previousEnd = undefined;
            this.virtualScroll.refresh();
            this.cdr.markForCheck();
          });
        }
        if((<any>changes).rowCountStream && (<any>changes).rowCountStream.currentValue) {
          this.rowCountStream.subscribe((count) => {
            this._rowCount = count;
            this.values = new Array(count);
            this.virtualScroll.previousStart = undefined;
            this.virtualScroll.previousEnd = undefined;
            this.virtualScroll.refresh();
            this.cdr.markForCheck();
          });
        }
		
    }

    onListChange(event: ChangeEvent) {
      let limit = event.end - event.start;
      this.requestRowDataSubject.next({offset: event.start, limit});
    }

    onRowClick(event: MouseEvent, row: any, index: number) {
        this.rowClick.emit({event, row, index});
    }


    toggleSortByColumn(col: MdlVirtualTableColumnComponent) {
        if (!col.sortable) {
            return;
        }

        col.sortDirection = col.sortDirection === 'asc' ? 'desc' : 'asc';
        this.sort.emit({column: col.field, direction: col.sortDirection});
    }

    refresh(withRowCount: boolean = false) {
      
      if(this.rowCountRequest.observers.length === 0) {
        throw new Error("mdl-virtual-table component has no rowCountRequest Listener");
      }
      if(this.rowDataRequest.observers.length === 0) {
        throw new Error("mdl-virtual-table component has no rowDataRequest Listener");
      }

      if(withRowCount) {
        this.requestRowCountSubject.next();
      }
      
      if(typeof(this.virtualScroll.previousStart) === 'number' 
        && typeof(this.virtualScroll.previousEnd) === 'number') {
        this.requestRowDataSubject.next({
          refresh: true,
          offset: this.virtualScroll.previousStart,
          limit: this.virtualScroll.previousEnd - this.virtualScroll.previousStart
        });
        this.virtualScroll.previousEnd = undefined;
        this.virtualScroll.previousStart = undefined;
      }
      this.virtualScroll.refresh();
    }
}
