import { Component, Input, ContentChild, TemplateRef, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'mdl-virtual-table-list',
    template: ''
})
export class MdlVirtualTableListComponent {


    @Input('breakpoint-max-width') set breakpointMaxWidth(v: number) {
        this._breakpointMaxWidth = parseInt("" + v);
    }
    get breakpointMaxWidth(): number {
        return this._breakpointMaxWidth;
    }
    
    @Input('item-height') set itemHeight(v: number) {
        this._itemHeight = parseInt("" + v);
    }
    get itemHeight(): number {
        return this._itemHeight;
    }
    
    get styledItemHeight(): string {
        return this._itemHeight - 11 + 'px';
    }
    sortDirection: string;

    @Output('item-click') itemClick: EventEmitter<any>;
    @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

    private _breakpointMaxWidth: number = 480;
    private _itemHeight: number = 51;

    constructor() {
        this.itemClick = new EventEmitter<any>();
    }
}