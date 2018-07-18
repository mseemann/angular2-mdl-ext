import {
    Component,
    Input,
    Output,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ViewChild,
    ContentChildren,
    ContentChild,
    EventEmitter,
    HostListener,
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
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/distinctUntilChanged';
import { MdlVirtualTableListComponent } from './list.component';
import { RowDataResponseInterface } from './index';
import { MdlCheckboxComponent } from '@angular-mdl/core';

declare var IntersectionObserver: any;

@Component({
    moduleId: module.id,
    selector: 'mdl-virtual-table',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: 'table.html',
    styleUrls: ['table.component.scss']
})

export class MdlVirtualTableComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    values: any[];

    @HostBinding('class.flex-height')

    @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;
    
    @ViewChild('tableWrapper') 
    private virutalScrollElement: ElementRef;

    @ViewChild('selectAllCheckbox')
    private selectAllCheckbox: MdlCheckboxComponent;

    @ContentChildren(MdlVirtualTableColumnComponent)
    columns: QueryList<MdlVirtualTableColumnComponent>;

    @ContentChild(MdlVirtualTableListComponent)
    responsiveList: MdlVirtualTableListComponent;

    @Input('row-count-stream') rowCountStream: Observable<number>;
    @Input('row-data-stream') rowDataStream: Observable<RowDataResponseInterface>;
    @Input('row-height') rowHeight: number = 48;
    @Input('max-height') maxHeight: string = '100vh';
    @Input('min-height') minHeight: string;
    
    @Input('flex-height')
    get isFlexHeight(): boolean {
        return this._isFlexHeight;
    }
    set isFlexHeight(value) {
        this._isFlexHeight = value != null && "" + value !== 'false';
    }
    
    @Input('init-refresh-disabled')
    get isInitialLoadDisabled(): boolean {
        return this._isInitialLoadDisabled;
    }
    set isInitialLoadDisabled(value) {
        this._isInitialLoadDisabled = value != null && "" + value !== 'false';
    }

    @Input('intersection-observer-disabled')
    get isIntersectionObserverDisabled(): boolean {
        return this._isIntersectionObserverDisabled;
    }
    set isIntersectionObserverDisabled(value) {
        this._isIntersectionObserverDisabled = value != null && "" + value !== 'false';
    }

    get selection():string[] {
      return Object.keys(this._rowSelectionByKey)
        .filter((key) => this._rowSelectionByKey[key] === true && key !== ''
        || key === '__all__' && this._rowSelectionByKey[key] !== false)
        .sort();
    }

    get rejection(): string[] {
      return Object.keys(this._rowSelectionByKey)
        .filter((key) => this._rowSelectionByKey[key] === false && key !== '__all__')
        .sort();
    }

    @Output() sort: EventEmitter<any>;
    @Output('row-click') rowClick: EventEmitter<any>;
    @Output('row-selection-change') rowSelection: EventEmitter<{selection: string[], rejection: string[]}>;    
    @Output('row-count-request') rowCountRequest: EventEmitter<any>;
    @Output('row-data-request') rowDataRequest: EventEmitter<{offset: number, limit: number, refresh?: boolean}>;

    public rows: any[];

    private _rowSelectionByKey: {[key: string]: boolean|string} = {};
    private _isInitialLoadDisabled: boolean = false;
    private _lastLoadedElementHash: string;
    private _useList: boolean = false;
    private _isIntersectionObserverDisabled: boolean = false;
    private _isFlexHeight: boolean = false;
    private _rowCount: number;
    private _visibleRowOffset: number;
    private _nativeElementObserver: any;
    private _requestRowCountSubject: Subject<any>;
    private _requestRowDataSubject: Subject<any>;

    constructor(private cdr: ChangeDetectorRef) {
      this.sort = new EventEmitter<any>();
      this.rowClick = new EventEmitter<any>();
      this.rowSelection = new EventEmitter<any>();
      this.rowCountRequest = new EventEmitter();
      this.rowDataRequest = new EventEmitter();
      this._requestRowCountSubject = new Subject<any>();
      this._requestRowDataSubject = new Subject<any>();
		  this._requestRowCountSubject.asObservable().subscribe(() => {
        this.rowCountRequest.emit();
      });
		  this._requestRowDataSubject.asObservable().distinctUntilChanged((x: any, y: any) => {
			  return (x.offset === y.offset && x.limit === y.limit) && !x.refresh && !y.refresh;
		  }).subscribe((result) => {
        this.rowDataRequest.emit(result);
      });
    }

    ngOnInit() {	
      if(!this.isInitialLoadDisabled)	{
        this.refresh(true);
      }
      this.checkUseList();
    }

    checkUseList() {
      this._useList = this.responsiveList && window.innerWidth <= this.responsiveList.breakpointMaxWidth;
      this.cdr.detectChanges();
    }
    
    ngAfterViewChecked() {
      if(!this._nativeElementObserver && this.virutalScrollElement && this.virutalScrollElement.nativeElement
        && !this.isIntersectionObserverDisabled) {
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
          let selectionColumn = this.columns.find((col: MdlVirtualTableColumnComponent) => col.rowSelectionEnabled);
          let lastRowDataSubscription = this.rowDataStream.subscribe((result: RowDataResponseInterface) => {
            this._visibleRowOffset = result.offset;
            this._rowCount = this._rowCount || result.rows.length;
            let values = new Array(this._rowCount);
            for (var i = result.offset; i < (result.rows.length + result.offset); i++) {
              values[i] = result.rows[i - result.offset];
              if (this._rowSelectionByKey['__all__'] && this._rowSelectionByKey[values[i][selectionColumn.field]] !== false) {
                this._rowSelectionByKey[values[i][selectionColumn.field]] = true;
              }
            }
            this.values = values;
            
            this.virtualScroll.previousStart = undefined;
            this.virtualScroll.previousEnd = undefined;
            this.virtualScroll.refresh();
            this.cdr.markForCheck();
          });
        }
        if((<any>changes).rowCountStream && (<any>changes).rowCountStream.currentValue) {
          this.rowCountStream.subscribe((count: number) => {
            this._rowCount = count;
            this.values = new Array(count);
            this.virtualScroll.previousStart = undefined;
            this.virtualScroll.previousEnd = undefined;
            this.virtualScroll.refresh();
            this.cdr.markForCheck();
          });
        }		
    }

    onSelectAllRows(selected: boolean) {
      for( let key in this._rowSelectionByKey) {
        if(selected) {
          this._rowSelectionByKey[key] = true;
        } else {
          delete this._rowSelectionByKey[key];
        }
      }
      if (selected) {
        let selectionColumn = this.columns.find((col: MdlVirtualTableColumnComponent) => col.rowSelectionEnabled);
        this.values.forEach((row) => {
          this._rowSelectionByKey[row[selectionColumn.field]] = true;
        });
      }
      this._rowSelectionByKey['__all__'] = selected;
      this.rowSelection.emit({selection: this.selection, rejection: this.rejection});
      this.cdr.detectChanges();
      
    }

    onChangeRowSelection(selected: boolean, key: string) {
      if (typeof(selected) === 'undefined') {
        return;
      }
      if (this._rowSelectionByKey[key] === selected) {
        return;
      }
      
      if (selected === false) {
        if (this._rowSelectionByKey['__all__'] === true) {
          this._rowSelectionByKey['__all__'] = 'auto';
        }
        this._rowSelectionByKey[key] = false;
      } else {
        this._rowSelectionByKey[key] = selected;
      }
      

      let rawSelection = Object.keys(this._rowSelectionByKey);
      let selection = rawSelection.filter((key => this._rowSelectionByKey[key])).sort();
      if (selected && this._rowSelectionByKey['__all__'] === 'auto') {
        this._rowSelectionByKey['__all__'] = rawSelection.length === selection.length || 'auto';
      }
      
      if (this.selectAllCheckbox) {
        this.selectAllCheckbox.writeValue(this._rowSelectionByKey['__all__'] === true);
      }
      this.rowSelection.emit({selection: this.selection, rejection: this.rejection});
    }

    onListChange(event: ChangeEvent) {
      let limit = event.end - event.start;
      this._requestRowDataSubject.next({offset: event.start, limit});
    }

    onListItemClick(event: MouseEvent, row: any, index: number) {
      this.responsiveList.itemClick.emit({event, row, index});
    }

    onRowClick(event: MouseEvent, row: any, index: number) {
        this.rowClick.emit({event, row, index});
    }

    @HostListener('window:resize', [])
    onWindowResize() {
      this.checkUseList();
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
        this._requestRowCountSubject.next();
        this.cdr.detectChanges();
      }
      
      /* istanbul ignore if */
      if (!this.virtualScroll) {
        return;
      }

      if(typeof(this.virtualScroll.previousStart) === 'number' 
        && typeof(this.virtualScroll.previousEnd) === 'number') {
        this._requestRowDataSubject.next({
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
