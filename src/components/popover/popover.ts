
import { Component, ModuleWithProviders, NgModule, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
    moduleId: module.id,
    selector: 'mdl-popover',
    templateUrl: 'popover.html',
    styleUrls: ['popover.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdlPopoverComponent {

}


@NgModule({
    imports: [CommonModule],
    exports: [MdlPopoverComponent],
    declarations: [MdlPopoverComponent],
})
export class MdlPopoverModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MdlPopoverModule,
            providers: []
        };
    }
}