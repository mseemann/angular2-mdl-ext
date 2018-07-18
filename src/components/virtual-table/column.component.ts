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
    
    @Input('row-selection-enabled') set rowSelection(v: boolean) {
        this._rowSelection = v !== null && "" + v !== 'false';
    }
    get rowSelectionEnabled(): boolean {
        return this._rowSelection;
    }
    @Input('select-all-enabled') set selectAllEnabled(v: boolean) {
        this._selectAllEnabled = v !== null && "" + v !== 'false';
    }
    get selectAllEnabled(): boolean {
        return this._selectAllEnabled;
    }

    private _sortable: boolean = false;
    private _rowSelection: boolean = false;
    private _selectAllEnabled: boolean = false;

    sortDirection: string;
    @ContentChild(TemplateRef) cellTemplate: TemplateRef<any>;
}