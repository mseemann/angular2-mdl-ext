import {
    Component,
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
    @Output() private ngModelChange: EventEmitter<any> = new EventEmitter(true);
    @ViewChild(MdlPopoverComponent) private popoverComponent: MdlPopoverComponent;
    @ContentChildren(MdlOptionComponent) private optionComponents: QueryList<MdlOptionComponent>;
    private textfieldId: string;
    private text: string = '';
    private textByValue: any = {};
    private onChange: any = Function.prototype;
    private onTouched: any = Function.prototype;

    constructor() {
        this.textfieldId = `mdl-textfield-${randomId()}`;
    }

    ngAfterViewInit() {
        this.textByValue[''] = this.placeholder;
        this.optionComponents.forEach((selectOptionComponent: MdlOptionComponent) => {
            selectOptionComponent.onSelect = this.onSelect.bind(this);
            this.textByValue[String(selectOptionComponent.value)] = selectOptionComponent.text;
        });
        this.renderValue(this.ngModel);
    }

    private renderValue(value: any) {
        this.text = !!value ? this.textByValue[String(value)] : '';

        if (this.optionComponents) {
            this.optionComponents.forEach((selectOptionComponent) => {
                selectOptionComponent.selectedValue = value;
            });
        }
    }

    toggle($event: Event) {
        if (!this.disabled) {
            this.popoverComponent.toggle($event);
        }
    }

    public onSelect(value: any) {
        this.popoverComponent.hide();
        this.writeValue(value);
        this.ngModelChange.emit(value);
    }

    writeValue(value: any): void {
        this.ngModel = value;
        this.onChange(value);
        this.renderValue(value);
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
