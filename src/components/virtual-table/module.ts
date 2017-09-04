import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { MdlVirtualTableComponent } from './table.component';
import { MdlVirtualTableColumnComponent } from './column.component';


@NgModule({
    imports: [
        CommonModule,
        VirtualScrollModule
    ],
    exports: [
        MdlVirtualTableComponent,
        MdlVirtualTableColumnComponent
    ],
    declarations: [
        MdlVirtualTableComponent,
        MdlVirtualTableColumnComponent
    ]
})
export class MdlVirtualTableModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MdlVirtualTableModule,
            providers: []
        };
    }
}