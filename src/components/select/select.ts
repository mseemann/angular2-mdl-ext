import {
    AfterContentInit,
    Component,
    ChangeDetectorRef,
    ContentChildren,
    ElementRef,
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

function toBoolean (value:any): boolean {
  return value != null && `${value}` !== 'false';
}

function randomId() {
    const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return (S4()+S4());
}

const MDL_SELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MdlSelectComponent),
    multi: true
};

export class SearchableComponent {
    private clearTimeout : any = null;
    private query : string = '';
    private searchTimeout: number;

    constructor(searchTimeout = 300) {
        this.searchTimeout = searchTimeout;
    }

    protected updateSearchQuery(event : any) {
        if(this.clearTimeout){
            clearTimeout(this.clearTimeout);
        }

        this.clearTimeout = setTimeout(() => {
            this.query = '';
        }, this.searchTimeout);

        this.query += String.fromCharCode(event.keyCode).toLowerCase();
    }

    protected getSearchQuery() : string {
        return this.query;
    }
}

@Component({
    moduleId: module.id,
    selector: 'mdl-select',
    host: {
        '[class.mdl-select]': 'true',
        '[class.mdl-select--floating-label]': 'isFloatingLabel',
        '[class.has-placeholder]': 'placeholder'
    },
    templateUrl: 'select.html',
    encapsulation: ViewEncapsulation.None,
    providers: [MDL_SELECT_VALUE_ACCESSOR]
})
export class MdlSelectComponent extends SearchableComponent implements ControlValueAccessor, AfterContentInit {
    @Input() ngModel: any;
    @Input() disabled: boolean = false;
    @Input() autocomplete: boolean = false;
    @Input() public label: string = '';
    @Input('floating-label')
    get isFloatingLabel() { return this._isFloatingLabel; }
    set isFloatingLabel(value) { this._isFloatingLabel = toBoolean(value); }
    @Input() placeholder: string = '';
    @Input() multiple: boolean = false;
    @Output() change: EventEmitter<any> = new EventEmitter(true);
    @Output() inputChange: EventEmitter<any> = new EventEmitter(true);
    @ViewChild('selectInput') selectInput: ElementRef;
    @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;
    @ContentChildren(MdlOptionComponent) public optionComponents: QueryList<MdlOptionComponent>;
    private _isFloatingLabel: boolean = false;
    textfieldId: string;
    text: string = '';
    private textByValue: any = {};
    private onChange: any = Function.prototype;
    private onTouched: any = Function.prototype;
    focused: boolean = false;

    constructor(private changeDetectionRef: ChangeDetectorRef) {
        super();
        this.textfieldId = `mdl-textfield-${randomId()}`;
    }

    public ngAfterContentInit() {
        this.bindOptions();
        this.renderValue(this.ngModel);
        this.optionComponents.changes.subscribe(() => {
            this.bindOptions();
            this.renderValue(this.ngModel);
        });
    }

    @HostListener('document:keydown', ['$event'])
    public onKeydown($event: KeyboardEvent): void {
        if (!this.disabled && this.popoverComponent.isVisible) {
            let closeKeys: Array<string> = ["Escape", "Tab", "Enter"];
            let closeKeyCodes: Array<Number> = [13, 27, 9];
            if (closeKeyCodes.indexOf($event.keyCode) != -1 || ($event.key && closeKeys.indexOf($event.key) != -1)) {
                this.popoverComponent.hide();
            } else if (!this.multiple) {
                if ($event.keyCode == 38 || ($event.key && $event.key == "ArrowUp")) {
                    this.onArrowUp($event);
                } else if ($event.keyCode == 40 || ($event.key && $event.key == "ArrowDown")) {
                    this.onArrowDown($event);
                } else if ($event.keyCode >= 31 && $event.keyCode <= 90) {
                    this.onCharacterKeydown($event); 
                }
            }
        }
    }

    onInputBlur() {
        if (this.autocomplete) {
            let autoSelectedValue = this.getAutoSelection();

            if (autoSelectedValue) {
                this.writeValue(autoSelectedValue);
                this.change.emit(this.ngModel);
            } else if (this.ngModel) {
                this.text = this.selectInput.nativeElement.value;
                this.changeDetectionRef.detectChanges();
                this.renderValue(this.ngModel);
            }
        }
    }

    isDirty(): boolean {
        return Boolean(this.selectInput.nativeElement.value);
    }

    onInputChange($event: Event) {
        const inputField = $event.target as HTMLInputElement,
            inputValue = inputField.value;

        this.inputChange.emit(inputValue);
    }

    private onCharacterKeydown($event : KeyboardEvent) : void {
        this.updateSearchQuery($event);

        if (!this.autocomplete) {
            let autoSelectedValue = this.getAutoSelection();

            if (autoSelectedValue) {
                this.onSelect($event, autoSelectedValue);
            }

            $event.preventDefault();
        }
    }

    private getAutoSelection(): any {
        const searchQuery = this.getSearchQuery();
        const optionsList = this.optionComponents.toArray();
        const filteredOptions = optionsList.filter(option => {
            return option.text.toLowerCase().startsWith(searchQuery);
        });

        const selectedOption = optionsList.find(option => option.selected);

        if (!searchQuery) {
            return null;
        }

        if (filteredOptions.length > 0) {
            const selectedOptionInFiltered = filteredOptions.indexOf(selectedOption) != -1;

            if(!selectedOptionInFiltered && !filteredOptions[0].selected){
                return filteredOptions[0].value;
            }
        }

        return null;
    }

    private onArrowUp($event: KeyboardEvent) {
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

    private onArrowDown($event: KeyboardEvent) {
        let arr = this.optionComponents.toArray();

        const selectedOption = arr.find(option => option.selected);

        if(selectedOption){
            const selectedOptionIndex = arr.indexOf(selectedOption);
            if (selectedOptionIndex + 1 < arr.length) {
                this.onSelect($event, arr[selectedOptionIndex + 1].value);
            }
        }else {
            this.onSelect($event, arr[0].value);
        }

        $event.preventDefault();
    }

    addFocus(): void {
        this.focused = true;
    }

    removeFocus(): void {
        this.focused = false;
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

            if (selectOptionComponent.value != null) {
                this.textByValue[this.stringifyValue(selectOptionComponent.value)] = selectOptionComponent.text;
            }
        });
    }

    private renderValue(value: any) {
        if (this.multiple) {
            this.text = value.map((value: string) => this.textByValue[this.stringifyValue(value)]).join(', ');
        } else {
            this.text = this.textByValue[this.stringifyValue(value)]||'';
        }
        this.changeDetectionRef.detectChanges();

        if (this.optionComponents) {
            this.optionComponents.forEach((selectOptionComponent) => {
                selectOptionComponent.updateSelected(value);
            });
        }
    }

    private stringifyValue(value: any): string {
        switch (typeof value) {
            case 'number': return String(value);
            case 'object': return JSON.stringify(value);
            default: return (!!value) ? String(value) : '';
        }
    }

    toggle($event: Event) {
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
        } else {
            let popover: any = this.popoverComponent.elementRef.nativeElement;
            let list: any = popover.querySelector(".mdl-list");
            let option: any = null;

            this.optionComponents.forEach(o => {
                // not great for long lists because break is not available
                if (o.value == value) {
                    option = o.contentWrapper.nativeElement;
                }
            });

            if (option) {
                const selectedItemElem = option.parentElement;
                const computedScrollTop = selectedItemElem.offsetTop - (list.clientHeight / 2) + (selectedItemElem.clientHeight / 2);
                list.scrollTop =  Math.max(computedScrollTop, 0);
            }
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
            } else if (this.ngModel.map((v:any) => this.stringifyValue(v)).indexOf(this.stringifyValue(value)) != -1) {
                this.ngModel = [...this.ngModel.filter((v: any) => this.stringifyValue(v) !== this.stringifyValue(value))];
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

    public setDisabledState(isDisabled: boolean) {
      this.disabled = isDisabled;
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
