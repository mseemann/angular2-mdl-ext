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
    @HostBinding('class.direction-up') public directionUp = false;

    private listener: any;

    constructor(private changeDetectionRef: ChangeDetectorRef,
                public elementRef: ElementRef) {}

    public ngAfterViewInit() {
        // Add a hide listener to native element
        this.listener = this.hide.bind(this);
        this.elementRef.nativeElement.addEventListener('hide', this.listener);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (this.isVisible &&
          (this.hideOnClick || !this.elementRef.nativeElement.contains(<Node>event.target))) {
            this.hide();
        }
    }

    public ngOnDestroy() {
       this.elementRef.nativeElement.removeEventListener('hide', this.listener);
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
      for(let i=0; i < nodeList.length;++i) {
        nodeList[i].dispatchEvent(new Event('hide'));
      }
    }

    public show(event: Event) {
        event.stopPropagation();
        this.isVisible = true;
        this.updateDirection(event);
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
})
export class MdlPopoverModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MdlPopoverModule,
            providers: []
        };
    }
}
