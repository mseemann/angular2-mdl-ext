import {
    Component,
    Input,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Renderer,
    ModuleWithProviders,
    NgModule,
    ViewEncapsulation,
    ChangeDetectionStrategy
} from '@angular/core';


@Component({
    // FIXME angular-cli errors with
    // url_resolver.js: Uncaught TypeError: uri.match is not a function
    // this could be fixed with http://stackoverflow.com/a/39346902/478584
    // but I dont know how to configure webpack preloaders in latest angular-cli
    // moduleId: module.id,
    selector: 'mdl-popover',
    host: {
        '[class.mdl-popover__container]': 'true'
    },
    templateUrl: 'popover.html',
    styleUrls: ['popover.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdlPopoverComponent implements AfterViewInit {
    @Input('hide-on-click') public hideOnClick: boolean = false;
    @Input('width') public width: string = '';

    @ViewChild('container') private containerChild: ElementRef;
    private container: HTMLElement;
    private isVisible   = false;

    constructor(private renderer: Renderer) {}

    public ngAfterViewInit() {
        this.container    = this.containerChild.nativeElement;

        // Add a click listener to the document, to close the popover.
        var callback = (event) => {
            if (this.isVisible && (this.hideOnClick || !this.container.contains(event.target))) {
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
        this.container.classList.remove('is-visible');
        this.isVisible = false;
    }

    public hideAllPopovers() {
        [].map.call(document.querySelectorAll('.mdl-popover__container.is-visible'), function(el) {
            el.classList.remove('is-visible');
        });
    }

    public show(event) {
        event.stopPropagation();
        this.container.classList.add('is-visible');
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
