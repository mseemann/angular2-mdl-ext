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
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MdlPopoverModule, MdlPopoverComponent } from '../popover';
import { MdlOptionComponent } from './index';

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
    styleUrls: ['select.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [MDL_SELECT_VALUE_ACCESSOR]
})
export class MdlSelectComponent implements ControlValueAccessor {
    @Input() ngModel: any;
    @Input() disabled: boolean = false;
    @Input() placeholder: string = '';
    @Input() multiple: boolean = false;
    @Output() private ngModelChange: EventEmitter<any> = new EventEmitter(true);
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

    ngAfterViewInit() {
        this.textByValue[''] = this.placeholder;
        this.optionComponents.forEach((selectOptionComponent: MdlOptionComponent) => {
            selectOptionComponent.multiple = this.multiple;
            selectOptionComponent.onSelect = this.onSelect.bind(this);
            this.textByValue[String(selectOptionComponent.value)] = selectOptionComponent.text;
        });
        this.renderValue(this.ngModel);
    }

    private renderValue(value: any) {
        if (this.multiple) {
            this.text = value.map((value: string) => this.textByValue[String(value)]).join(', ');
        } else {
            this.text = !!value ? this.textByValue[String(value)] : '';
        }
        this.changeDetectionRef.detectChanges();

        if (this.optionComponents) {
            this.optionComponents.forEach((selectOptionComponent) => {
                selectOptionComponent.updateSelected(value);
            });
        }
    }

    toggle($event: Event) {
        if (!this.disabled) {
            this.popoverComponent.toggle($event);
        }
    }

    public onSelect($event: Event, value: any) {
        if (this.multiple) {
            // prevent popup close on click inside popover when selecting multiple
            $event.stopPropagation();
        }
        this.writeValue(value);
        this.ngModelChange.emit(this.ngModel);
    }

    writeValue(value: any): void {
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

    registerOnChange(fn: (value: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }
}


@NgModule({
    imports: [
        BrowserModule,
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
