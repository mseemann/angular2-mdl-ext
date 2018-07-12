import { Component, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
    selector: 'mdl-column',
    template: ''
})
export class MdlVirtualTableColumnComponent {
    @Input() label: string;
    @Input() field: string;
    @Input() width: string;
    @Input() set sortable(v: boolean) {
        this._sortable = v !== null && "" + v !== 'false';
    }
    get sortable(): boolean {
        return this._sortable;
    }
    _sortable: boolean = false;
    @Input('row-selection-enabled') set rowSelection(v: boolean) {
        this._rowSelection = v !== null && "" + v !== 'false';
    }
    get rowSelection(): boolean {
        return this._rowSelection;
    }
    _rowSelection: boolean = false;

    sortDirection: string;
    @ContentChild(TemplateRef) cellTemplate: TemplateRef<any>;
}