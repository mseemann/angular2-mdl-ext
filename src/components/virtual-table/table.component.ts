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
    HostBinding
} from '@angular/core';
import {VirtualScrollComponent, ChangeEvent} from 'angular2-virtual-scroll';
import {MdlVirtualTableColumnComponent} from './column.component';

@Component({
    selector: 'mdl-virtual-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div class="table-container mdl-data-table mdl-js-data-table mdl-data-table--selectable" [class.flex-height]="isFlexHeight">
  <div class="table-header">
   <div class="row">
      <div class="header-cell" *ngFor="let col of columns" [style.width]="col.width ? col.width : '100%'"
        [class.sortable]="col.sortable" [class.asc]="col.sortDirection === 'asc'" [class.desc]="col.sortDirection === 'desc'" (click)="toggleSortByColumn(col)">
        {{col.label}}</div>
    </div>
    </div>
    <virtual-scroll #scroll [style.maxHeight]="maxHeight" [style.minHeight]="minHeight" [items]="values" (change)="onListChange($event)" (update)="shownValues = $event">
      <div #container class="table">
           <div class="row" *ngFor="let row of shownValues; let i = index" (click)="onRowClick($event, row, _visibleRowOffset + i)">
            <div class="cell" *ngFor="let col of columns" [style.width]="col.width ? col.width : '1%'">
              <ng-container *ngTemplateOutlet="col.cellTemplate ? col.cellTemplate : defaultCellTemplate; context: {$implicit: row ? row[col.field] : '', row: row}"></ng-container>
            </div>
          </div>
      </div>
    </virtual-scroll>
    <ng-template #defaultCellTemplate let-value><span>{{value}}</span></ng-template>
    </div>
  `,
    styles: [`
    :host.flex-height,
    .flex-height virtual-scroll,
    .flex-height.table-container {
        display: flex;
    }
    
    .flex-height.table-container {
        flex-direction: column;
    }
    
    virtual-scroll {
          width: 100%;
          display: block;
    }
    
    .table-header {
      table-layout: fixed;
      border-bottom: 1px solid rgba(0,0,0,.12);
    }
    .table {
      width: 100%;
      table-layout: fixed;
    }
    .row {
        display: table-row;
        height: 30px;
        width: 100%;
    }
    
    .cell {
        display: table-cell;
        position: relative;
        height: 48px;
        border-top: 1px solid rgba(0,0,0,.12);
        border-bottom: 1px solid rgba(0,0,0,.12);
        padding: 12px 18px;
        box-sizing: border-box;
        vertical-align: middle;
        width: 100%;
    }
    
    .row:first-child .cell {
      border-top: none;
    }
    
    .table .row {
      transition-duration: .28s;
      transition-timing-function: cubic-bezier(.4,0,.2,1);
      transition-property: background-color;
    }
    
    .table .row:hover {
      background-color: #eee;
    }
    
    .header-cell {
      position: relative;
      vertical-align: bottom;
      text-overflow: ellipsis;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 0;
      height: 48px;
      font-size: 12px;
      color: rgba(0,0,0,.54);
      padding-bottom: 8px;
      box-sizing: border-box;
      display: table-cell;
      padding: 0 18px 12px 18px;
      text-align: left;
      width: 100%;
    }
    
    .header-cell.sortable {
      cursor: pointer;
    }
    .header-cell.sortable:after {
      font-family: 'Material Icons';
      font-size: 20pt;
      content: 'arrow_drop_down arrow_drop_up';
      vertical-align: middle;
      letter-spacing: -11px;
      position: absolute;
    }
    
    .header-cell.sortable.desc:after {
      content: 'arrow_drop_down';
    }
    .header-cell.sortable.asc:after {
      content: 'arrow_drop_up';
    }
    
  `]
})
export class MdlVirtualTableComponent implements OnInit {
    values: any[];

    @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;

    @ContentChildren(MdlVirtualTableColumnComponent)
    private columns: MdlVirtualTableColumnComponent;
    private lastLoadedElementHash: string;

    @Input() fetchRowCount: Function;
    @Input() fetchRowData: Function;

    @Input() maxHeight: string = '100vh';

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

    @Output() sort: EventEmitter<any> = new EventEmitter<any>();
    @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(private cdr: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.refresh();
    }

    fetch(offset: number, limit: number) {
        let hash = offset + ':' + limit;
        if (this.lastLoadedElementHash === hash) {
            return;
        }
        this._visibleRowOffset = offset;
        this.fetchRowData(offset, limit).subscribe((rows: any[]) => {
            this.values = new Array(this._rowCount);
            for (var i = offset; i < (rows.length + offset); i++) {
                this.values[i] = rows[i - offset];
            }
            this.cdr.markForCheck();
            this.lastLoadedElementHash = hash;
        });
    }

    onListChange(event: ChangeEvent) {
        this.fetch(event.start, (event.end - event.start));
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

    refresh() {
        if(!this.fetchRowCount) {
            // TODO maybe we should throw an error that tells the developer what is missing.
            return;
        }

        this.fetchRowCount().subscribe((count: number) => {
            this._rowCount = count;
            this.values = new Array(count);
            this.virtualScroll.previousStart = undefined;
            this.virtualScroll.refresh();
        });

    }
}