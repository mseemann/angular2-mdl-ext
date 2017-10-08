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
import { MdlButtonComponent } from '@angular-mdl/core';

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
        this.popoverComponents.forEach((component) => {
            if (component !== popoverComponent) {
                component.hide();
            }
        });
    }
}

const BOTTOM_LEFT = 'bottom-left'; // Below the element, aligned to its left.
const BOTTOM_RIGHT = 'bottom-right'; // Below the element, aligned to its right.
const TOP_LEFT = 'top-left'; // Above the element, aligned to its left.
const TOP_RIGHT = 'top-right'; // Above the element, aligned to its right.

export interface IPositionCoordinates {
    left: number;
    top: number;
}

@Injectable()
export class PopupPositionService {
    public applyCoordinates(coordinates: IPositionCoordinates, elementStyle: CSSStyleDeclaration) {
        if (!coordinates) {
            return;
        }

        elementStyle.right =
            elementStyle.bottom = '';

        elementStyle.left = coordinates.left + 'px';
        elementStyle.top = coordinates.top + 'px';
    }

    public calculateCoordinates(forElement: HTMLElement, popoverElement: HTMLElement, position: string): IPositionCoordinates {
        if (!forElement || !position) {
            return null;
        }

        switch (position) {
            case BOTTOM_RIGHT:
                return {
                    top: forElement.offsetTop + forElement.offsetHeight,
                    left: forElement.offsetLeft + forElement.offsetWidth - popoverElement.offsetWidth
                };
            case BOTTOM_LEFT:
                return {
                    top: forElement.offsetTop + forElement.offsetHeight,
                    left: forElement.offsetLeft
                };
            case TOP_LEFT:
                return {
                    top: forElement.offsetTop - popoverElement.offsetHeight,
                    left: forElement.offsetLeft
                };
            case TOP_RIGHT:
                return {
                    top: forElement.offsetTop - popoverElement.offsetHeight,
                    left: forElement.offsetLeft + forElement.offsetWidth - popoverElement.offsetWidth
                };
        }
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
    @Input('mdl-popover-position') public position: string;
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
        private popoverRegistry: MdlPopoverRegistry,
        private popupPositionService: PopupPositionService) {
        this.popoverRegistry.add(this);
    }

    public ngOnDestroy() {
        this.popoverRegistry.remove(this);
    }

    public toggle(event: Event, forElement: any = null) {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(event, forElement);
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

    public show(event: Event, forElement: any = null) {
        this.hideAllPopovers();
        event.stopPropagation();
        if (!this.isVisible) {
            this.onShow.emit(null);
            this.isVisible = true;
            this.updateDirection(event, forElement);
        }
    }

    private updateDirection(event: Event, forElement: any = null) {
        const popoverElement = this.elementRef.nativeElement;
        const targetRect = (<HTMLElement>event.target).getBoundingClientRect();
        const viewHeight = window.innerHeight;

        setTimeout(() => {
            if (forElement && this.position) {
                const forHtmlElement = this.getHtmlElement(forElement);
                const coordinates = this.popupPositionService.calculateCoordinates(forHtmlElement, popoverElement, this.position);
                this.popupPositionService.applyCoordinates(coordinates, popoverElement.style);

                this.changeDetectionRef.markForCheck();
                // since we have user specified directions maybe it's better to let user to decide when and where the popup should be directed at?
                // my point: we should not use the following code with "auto dirrection up"
                return;
            }

            const height = popoverElement.offsetHeight;
            if (height) {
                const bottomSpaceAvailable = viewHeight - targetRect.bottom
                this.directionUp = bottomSpaceAvailable < height;
                this.changeDetectionRef.markForCheck();
            }
        });
    }

    private getHtmlElement(forElement: any): HTMLElement {
        if (forElement instanceof MdlButtonComponent) {
            const buttonComponent = <MdlButtonComponent>forElement;
            return buttonComponent.elementRef.nativeElement;
        }

        if (forElement instanceof ElementRef) {
            const elementRef = <ElementRef>forElement;
            return elementRef.nativeElement;
        }

        return forElement;
    }
}

@NgModule({
    imports: [],
    exports: [MdlPopoverComponent],
    declarations: [MdlPopoverComponent],
    providers: [MdlPopoverRegistry, PopupPositionService],
})
export class MdlPopoverModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MdlPopoverModule,
            providers: []
        };
    }
}
