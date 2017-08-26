import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Inject,
    Injectable,
    Input,
    ModuleWithProviders,
    NgModule,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class MdlPopoverRegistry {
    private popoverComponents: any[] = [];

    constructor(@Inject(DOCUMENT) private doc: any) {
        this.doc.addEventListener('click', () => {
            this.popoverComponents
                .filter((component: MdlPopoverComponent) => component.isVisible)
                .forEach((component: MdlPopoverComponent) => component.hide());
        });
    };

    public add(popoverComponent: MdlPopoverComponent) {
        this.popoverComponents.push(popoverComponent);
    }

    public remove(popoverComponent: MdlPopoverComponent) {
        this.popoverComponents.slice(this.popoverComponents.indexOf(popoverComponent), 1);
    }

    public hideAllExcept(popoverComponent: MdlPopoverComponent) {
        this.popoverComponents.forEach( (component) => {
            if (component !== popoverComponent) {
                component.hide();
            }
        });
    }
}

@Component({
    moduleId: module.id,
    selector: 'mdl-popover',
    host: {
        '[class.mdl-popover]': 'true'
    },
    templateUrl: 'popover.html',
    encapsulation: ViewEncapsulation.None,
})
export class MdlPopoverComponent {
    @Input('hide-on-click') public hideOnClick: boolean = false;
    @Output() onShow: EventEmitter<any> = new EventEmitter();
    @Output() onHide: EventEmitter<any> = new EventEmitter();
    @HostBinding('class.is-visible') public isVisible = false;
    @HostBinding('class.direction-up') public directionUp = false;
    @HostListener('click', ['$event']) onClick(event: Event) {
        if (!this.hideOnClick) {
            event.stopPropagation();
        }
    }

    constructor(private changeDetectionRef: ChangeDetectorRef,
                public elementRef: ElementRef,
                private popoverRegistry: MdlPopoverRegistry) {
        this.popoverRegistry.add(this);
    }

    public ngOnDestroy() {
       this.popoverRegistry.remove(this);
    }

    public toggle(event: Event) {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(event);
        }
    }

    public hide() {
        if (this.isVisible) {
            this.onHide.emit(null);
            this.isVisible = false;
            this.changeDetectionRef.markForCheck();
        }
    }

    private hideAllPopovers() {
        this.popoverRegistry.hideAllExcept(this);
    }

    public show(event: Event) {
        this.hideAllPopovers();
        event.stopPropagation();
        if (!this.isVisible) {
            this.onShow.emit(null);
            this.isVisible = true;
            this.updateDirection(event);
        }
    }

    private updateDirection(event: Event) {
        const nativeEl = this.elementRef.nativeElement;
        const targetRect = (<HTMLElement>event.target).getBoundingClientRect();
        const viewHeight = window.innerHeight;

        setTimeout(() => {
            let height = nativeEl.offsetHeight;
            if (height) {
                const spaceAvailable = {
                    top: targetRect.top,
                    bottom: viewHeight - targetRect.bottom
                };
                this.directionUp = spaceAvailable.bottom < height;
                this.changeDetectionRef.markForCheck();
            }
        });
    }
}


@NgModule({
    imports: [],
    exports: [MdlPopoverComponent],
    declarations: [MdlPopoverComponent],
    providers: [MdlPopoverRegistry],
})
export class MdlPopoverModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MdlPopoverModule,
            providers: []
        };
    }
}
