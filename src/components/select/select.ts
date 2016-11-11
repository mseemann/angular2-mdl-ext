import {
    Component,
    ChangeDetectorRef,
    ContentChildren,
    EventEmitter,
    forwardRef,
    Input,
    ModuleWithProviders,
    NgModule,
    Output,
    QueryList,
    ViewChild,
    ViewEncapsulation,
    HostListener
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdlPopoverModule, MdlPopoverComponent } from '../popover/index';
import { MdlOptionComponent } from './option';

const uniq = (array: any[]) => Array.from(new Set(array));

function randomId() {
    const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return (S4()+S4());
}

const MDL_SELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MdlSelectComponent),
    multi: true
};

@Component({
    moduleId: module.id,
    selector: 'mdl-select',
    host: {
        '[class.mdl-select]': 'true'
    },
    templateUrl: 'select.html',
    encapsulation: ViewEncapsulation.None,
    providers: [MDL_SELECT_VALUE_ACCESSOR]
})
export class MdlSelectComponent implements ControlValueAccessor {
    @Input() ngModel: any;
    @Input() disabled: boolean = false;
    @Input() placeholder: string = '';
    @Input() multiple: boolean = false;
    @Output() private change: EventEmitter<any> = new EventEmitter(true);
    @ViewChild(MdlPopoverComponent) private popoverComponent: MdlPopoverComponent;
    @ContentChildren(MdlOptionComponent) private optionComponents: QueryList<MdlOptionComponent>;
    private textfieldId: string;
    private text: string = '';
    private textByValue: any = {};
    private onChange: any = Function.prototype;
    private onTouched: any = Function.prototype;

    constructor(private changeDetectionRef: ChangeDetectorRef) {
        this.textfieldId = `mdl-textfield-${randomId()}`;
    }

    public ngAfterViewInit() {
        this.bindOptions();
        this.renderValue(this.ngModel);
        this.optionComponents.changes.subscribe(() => this.bindOptions());
    }

    @HostListener('keydown.arrowUp', ['$event'])
    public onArrowUp($event: Event): void {
        if (!this.disabled && !this.multiple) {
            let arr = this.optionComponents.toArray();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].selected) {
                    if (i - 1 >= 0) {
                        this.onSelect($event, arr[i-1].value);
                    }

                    break;
                }
            }

            $event.preventDefault();
        }
    }

    @HostListener('keydown.arrowDown', ['$event'])
    public onArrowDown($event: Event): void {
        if (!this.disabled && !this.multiple) {
            let arr = this.optionComponents.toArray();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].selected) {
                    if (i + 1 < arr.length) {
                        this.onSelect($event, arr[i+1].value);
                    }

                    break;
                }
            }

            $event.preventDefault();
        }
    }

    @HostListener('keydown.enter', ['$event'])
    @HostListener('keydown.esc', ['$event'])
    @HostListener('keydown.tab', ['$event'])
    @HostListener('keydown.shift.tab', ['$event'])
    public onKeydown($event: Event): void {
        if (!this.disabled) {
            this.popoverComponent.hide();
        }
    }

    private isEmpty() {
        return this.multiple ? !this.ngModel.length : !this.ngModel;
    }

    // rebind options and reset value in connected select
    public reset(resetValue: boolean = true) {
        if (resetValue && !this.isEmpty()) {
            this.ngModel = this.multiple ? [] : '';
            this.onChange(this.ngModel);
            this.change.emit(this.ngModel);
            this.renderValue(this.ngModel);
        }
    }

    private bindOptions() {
        this.optionComponents.forEach((selectOptionComponent: MdlOptionComponent) => {
            selectOptionComponent.setMultiple(this.multiple);
            selectOptionComponent.onSelect = this.onSelect.bind(this);
            this.textByValue[String(selectOptionComponent.value||'')] = selectOptionComponent.text;
        });
    }

    private renderValue(value: any) {
        if (this.multiple) {
            this.text = value.map((value: string) => this.textByValue[String(value)]).join(', ');
        } else {
            this.text =
              (!!value || typeof value === 'number')
              ? this.textByValue[String(value)]
              : '';
        }
        this.changeDetectionRef.detectChanges();

        if (this.optionComponents) {
            this.optionComponents.forEach((selectOptionComponent) => {
                selectOptionComponent.updateSelected(value);
            });
        }
    }

    private toggle($event: Event) {
        if (!this.disabled) {
            this.popoverComponent.toggle($event);
            $event.stopPropagation();
        }
    }

    public open($event: Event) {
        if (!this.disabled && !this.popoverComponent.isVisible) {
            this.popoverComponent.show($event);
        }

    }

    public close($event: Event) {
        if (!this.disabled && this.popoverComponent.isVisible) {
            this.popoverComponent.hide();
        }
    }

    private onSelect($event: Event, value: any) {
        if (this.multiple) {
            // prevent popup close on click inside popover when selecting multiple
            $event.stopPropagation();
        }
        this.writeValue(value);
        this.change.emit(this.ngModel);
    }

    public writeValue(value: any): void {
        if (this.multiple) {
            this.ngModel = this.ngModel || [];
            if (!value || this.ngModel === value) {
                // skip ngModel update when undefined value or multiple selects initialized with same array
            } else if (Array.isArray(value)) {
                this.ngModel = uniq(this.ngModel.concat(value));
            } else if (this.ngModel.includes(value)) {
                this.ngModel = [...this.ngModel.filter((v: string) => v !== value)];
            } else if (!!value) {
                this.ngModel = [...this.ngModel, value];
            }
        } else {
            this.ngModel = value;
        }
        this.onChange(this.ngModel);
        this.renderValue(this.ngModel);
    }

    public registerOnChange(fn: (value: any) => void) {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }
}


@NgModule({
    imports: [
        CommonModule,
        MdlPopoverModule
    ],
    exports: [
        MdlSelectComponent,
        MdlOptionComponent
    ],
    declarations: [
        MdlSelectComponent,
        MdlOptionComponent
    ],
    providers: [
        MDL_SELECT_VALUE_ACCESSOR
    ]
})
export class MdlSelectModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MdlSelectModule,
            providers: []
        };
    }
}
