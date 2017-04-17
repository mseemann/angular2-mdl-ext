import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    ModuleWithProviders,
    NgModule,
    ViewEncapsulation
} from '@angular/core';
import { Element } from '@angular/compiler';

type Direction = 'top' | 'bottom' | 'right' | 'left' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';

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
    @Input('direction') public direction: Direction = 'bottom';
    @HostBinding('class.is-visible') public isVisible = false;
    @HostBinding('class.direction-up') public directionUp = false;

    constructor(private changeDetectionRef: ChangeDetectorRef,
                public elementRef: ElementRef) {
    }

    public ngAfterViewInit() {
        // Add a hide listener to native element
        this.elementRef.nativeElement.addEventListener('hide', this.hide.bind(this));
    }

    @HostListener('document:click', [ '$event' ])
    onDocumentClick(event: Event) {
        if (this.isVisible &&
            (this.hideOnClick || !this.elementRef.nativeElement.contains(<Node>event.target))) {
            this.hide();
        }
    }

    public ngOnDestroy() {
        this.elementRef.nativeElement.removeEventListener('hide');
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
        let nodeList = document.querySelectorAll('.mdl-popover.is-visible');
        for (let i = 0; i < nodeList.length; ++i) {
            nodeList[ i ].dispatchEvent(new Event('hide'));
        }
    }

    public show(event: Event) {
        event.stopPropagation();
        this.isVisible = true;
        this.updateDirection(event);
    }


    private updateDirection(event: Event) {

        const nativeEl = this.elementRef.nativeElement;
        const targetRect = this.getAbsoluteBoundingRect(<HTMLElement>event.target);
        const nativeRect = this.getAbsoluteBoundingRect(nativeEl);
        const viewHeight = window.innerHeight;

        this.getRelativePositionToInitiator(targetRect, nativeRect, nativeEl);

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

    private getRelativePositionToInitiator(initiatorBounds, elementRefBounds, nativeEl) {

        switch (this.direction) {
        case 'right':
            nativeEl.style.left = (initiatorBounds.left + initiatorBounds.width) + 'px';
            nativeEl.style.top = (initiatorBounds.top) + 'px';
            break;
        case 'left':
            nativeEl.style.left = (initiatorBounds.left - elementRefBounds.width) + 'px';
            nativeEl.style.top = (initiatorBounds.top) + 'px';
            break;
        case 'bottomLeft':
            nativeEl.style.left = (initiatorBounds.left - elementRefBounds.width) + 'px';
            nativeEl.style.top = (initiatorBounds.top + initiatorBounds.height) + 'px';
            break;
        case 'bottom':
            nativeEl.style.left = (initiatorBounds.left) + 'px';
            nativeEl.style.top = (initiatorBounds.top + pageYOffset) + 'px';
            break;
        case 'bottomRight':
            nativeEl.style.left = (initiatorBounds.left + initiatorBounds.width) + 'px';
            nativeEl.style.top = (initiatorBounds.top + initiatorBounds.height) + 'px';
            break;
        case 'top':
            nativeEl.style.left = (initiatorBounds.left) + 'px';
            nativeEl.style.top = (initiatorBounds.top - elementRefBounds.height - initiatorBounds.height) + 'px';
            break;
        case 'topRight':
            nativeEl.style.left = (initiatorBounds.left + initiatorBounds.width ) + 'px';
            nativeEl.style.top = ((initiatorBounds.top - initiatorBounds.height) - elementRefBounds.height ) + 'px';
            break;
        case 'topLeft':
            nativeEl.style.left = (initiatorBounds.left - initiatorBounds.height) + 'px';
            nativeEl.style.top = (initiatorBounds.top - elementRefBounds.height) + 'px';
            break;
        }
    }

    private getAbsoluteBoundingRect(el) {
        let doc = document,
            win = window,
            body = doc.body,

            // pageXOffset and pageYOffset work everywhere except IE <9.
            offsetX = win.pageXOffset !== undefined ? win.pageXOffset :
                (doc.documentElement  || body).scrollLeft,
            offsetY = win.pageYOffset !== undefined ? win.pageYOffset :
                (doc.documentElement  || body).scrollTop,

            rect = el.getBoundingClientRect();

        if (el !== body) {
            let parent = el.parentNode;

            // The element's rect will be affected by the scroll positions of
            // *all* of its scrollable parents, not just the window, so we have
            // to walk up the tree and collect every scroll offset. Good times.
            while (parent !== body) {
                offsetX += parent.scrollLeft;
                offsetY += parent.scrollTop;
                parent = parent.parentNode;
            }
        }

        return {
            bottom: rect.bottom + offsetY,
            height: rect.height,
            left: rect.left + offsetX,
            right: rect.right + offsetX,
            top: rect.top + offsetY,
            width: rect.width
        };
    }

}


@NgModule({
    imports: [],
    exports: [ MdlPopoverComponent ],
    declarations: [ MdlPopoverComponent ],
})
export class MdlPopoverModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MdlPopoverModule,
            providers: []
        };
    }
}
