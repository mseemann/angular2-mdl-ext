import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    Input,
    ModuleWithProviders,
    NgModule,
    Renderer,
    ViewEncapsulation
} from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'mdl-popover',
    host: {
        '[class.mdl-popover]': 'true'
    },
    templateUrl: 'popover.html',
    styleUrls: ['popover.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MdlPopoverComponent implements AfterViewInit {
    @Input('hide-on-click') public hideOnClick: boolean = false;
    @HostBinding('class.is-visible') public isVisible = false;

    constructor(private elementRef: ElementRef,
                private renderer: Renderer) {}

    public ngAfterViewInit() {
        // Add a click listener to the document, to close the popover.
        var callback = (event: Event) => {
            if (this.isVisible &&
               (this.hideOnClick || !this.elementRef.nativeElement.contains(<Node>event.target))) {
                this.hide();
            }
        };
        this.renderer.listenGlobal('window', 'click', callback);
        this.renderer.listenGlobal('window', 'touchstart', callback);
    }

    public toggle(event: Event) {
        if (this.isVisible) {
            this.hide();
        } else {
            this.hideAllPopovers();
            this.show(event);
        }
    }

    public hide() {
        this.isVisible = false;
    }

    private hideAllPopovers() {
        [].map.call(
          document.querySelectorAll('.mdl-popover__container.is-visible'),
          (el: Element) => el.classList.remove('is-visible')
        );
    }

    private show(event: Event) {
        event.stopPropagation();
        this.isVisible = true;
    }
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
