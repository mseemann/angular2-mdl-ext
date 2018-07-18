import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlModule } from '@angular-mdl/core';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { MdlVirtualTableComponent } from './table.component';
import { MdlVirtualTableColumnComponent } from './column.component';
import { MdlVirtualTableListComponent } from './list.component';


@NgModule({
    imports: [
        CommonModule,
        MdlModule,
        VirtualScrollModule
    ],
    exports: [
        MdlVirtualTableComponent,
        MdlVirtualTableColumnComponent,
        MdlVirtualTableListComponent
    ],
    declarations: [
        MdlVirtualTableComponent,
        MdlVirtualTableColumnComponent,
        MdlVirtualTableListComponent
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