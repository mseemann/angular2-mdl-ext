import {
    AfterViewInit,
    ChangeDetectorRef,
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
    encapsulation: ViewEncapsulation.None,
})
export class MdlPopoverComponent implements AfterViewInit {
    @Input('hide-on-click') public hideOnClick: boolean = false;
    @HostBinding('class.is-visible') public isVisible = false;
    private removeEventListenWindowClick: Function;
    private removeEventListenWindowTouchstart: Function;

    constructor(private changeDetectionRef: ChangeDetectorRef,
                private elementRef: ElementRef,
                private renderer: Renderer) {}

    public ngAfterViewInit() {
        // Add a hide listener to native element
        this.elementRef.nativeElement.addEventListener('hide', this.hide.bind(this));

        // Add a click listener to the document to close the popover
        var callback = (event: Event) => {
            if (this.isVisible &&
               (this.hideOnClick || !this.elementRef.nativeElement.contains(<Node>event.target))) {
                this.hide();
            }
        };
        this.removeEventListenWindowClick = this.renderer.listenGlobal('window', 'click', callback);
        this.removeEventListenWindowTouchstart = this.renderer.listenGlobal('window', 'touchstart', callback);
    }

    public ngOnDestroy() {
        this.elementRef.nativeElement.removeEventListener('hide');
        this.removeEventListenWindowClick();
        this.removeEventListenWindowTouchstart();
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
        this.changeDetectionRef.markForCheck();
    }

    private hideAllPopovers() {
        [].map.call(
          document.querySelectorAll('.mdl-popover.is-visible'),
          (el: Element) => el.dispatchEvent(new Event('hide'))
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
