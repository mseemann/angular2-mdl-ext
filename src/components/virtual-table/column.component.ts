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
        // TODO why did you compare with 'true'? if the type is boolean it musst be true or false.
        this._sortable = typeof(v) === 'boolean' ? v : (v === 'true');
    }
    get sortable(): boolean {
        return this._sortable;
    }
    _sortable: boolean = false;

    sortDirection: string;
    @ContentChild(TemplateRef) cellTemplate: TemplateRef<any>;
}