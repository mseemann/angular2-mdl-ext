import {
    Component,
    ModuleWithProviders,
    NgModule,
    ViewEncapsulation,
    ChangeDetectionStrategy
} from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'mdl-popover',
    host: {
        '[class.mdl-popover__container]': 'true'
    },
    templateUrl: 'popover.html',
    styleUrls: ['popover.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdlPopoverComponent {

}


@NgModule({
    imports: [],
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