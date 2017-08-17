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

function isArrowUp (event: KeyboardEvent): boolean {
    return event.keyCode === 38 || (event.key && event.key == 'ArrowUp');
}

function isArrowDown(event: KeyboardEvent): boolean {
    return event.keyCode === 40 || (event.key && event.key == 'ArrowDown');
}

function isTab(event: KeyboardEvent): boolean {
    return event.keyCode === 9;
}

function isKeyEventHidePopup(event: KeyboardEvent) {
    const closeKeys: Array<string> = ['Escape', 'Tab', 'Enter'],
        closeKeyCodes: Array<Number> = [27, 9, 13];
    return closeKeyCodes.indexOf(event.keyCode) != -1 || (event.key && closeKeys.indexOf(event.key) != -1);
}

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
    @Input() autoselectOnBlur: boolean = false;
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
            if (isKeyEventHidePopup($event)) {
                this.popoverComponent.hide();
            } else if (!this.multiple) {
                if (isArrowUp($event)) {
                    this.onArrowUp($event);
                } else if (isArrowDown($event)) {
                    this.onArrowDown($event);
                } else if ($event.keyCode >= 31 && $event.keyCode <= 90) {
                    this.onCharacterKeydown($event); 
                }
            }
        }
    }

    onInputBlur(event: FocusEvent) {
        if (this.autoselectOnBlur && !this.isBlurLeadToPopover(event.relatedTarget as Element)) {
            const currentOption = this.getCurrentOption(),
                autoSelectedValue = this.getAutoSelection(),
                value = autoSelectedValue || (currentOption ? currentOption.value : this.ngModel);

            this.resetText();

            this.writeValue(value);
            this.change.emit(value);
        }
    }

    private resetText() {
        this.text = this.selectInput.nativeElement.value;
        this.changeDetectionRef.detectChanges();
    }

    private getCurrentOption() {
        return this.optionComponents ? this.optionComponents.toArray().find(option => option.selected) : null;
    }

    private isBlurLeadToPopover(relatedTarget: Element) {
        const popover = this.popoverComponent.elementRef.nativeElement;
        return relatedTarget && (relatedTarget === popover || popover.contains(relatedTarget));
    }

    isDirty(): boolean {
        return Boolean(this.selectInput.nativeElement.value);
    }

    onKeyUp($event: KeyboardEvent) {
        const inputField = $event.target as HTMLInputElement,
            inputValue = inputField.value;

        if (isKeyEventHidePopup($event) && !isTab($event)) {
            inputField.blur();
        } else if (!isArrowDown($event) && !isArrowUp($event)) {
            this.inputChange.emit(inputValue);
        }
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
        let optionsList = this.optionComponents.toArray();
        const filteredOptions = optionsList.filter(option => {
            return option.text.toLowerCase().startsWith(this.getSearchQuery());
        });

        const selectedOption = optionsList.find(option => option.selected);

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
                    const value = arr[i-1].value;
                    if (this.autocomplete) {
                        this.focusValue(value);
                    } else {
                        this.onSelect($event, value);
                    }
                }

                break;
            }
        }

        $event.preventDefault();
    }

    private onArrowDown($event: KeyboardEvent) {
        const arr = this.optionComponents.toArray(),
            selectedOption = arr.find(option => option.selected),
            selectedOptionIndex = arr.indexOf(selectedOption),
            optionForSelection = selectedOption !== null
                ? arr[selectedOptionIndex + 1]
                : arr[0];

        if (optionForSelection) {
            const value = optionForSelection.value;

            if (this.autocomplete) {
                this.focusValue(value);
            } else {
                this.onSelect($event, value);
            }
        }

        $event.preventDefault();
    }

    private focusValue(value: any) {
        this.scrollToValue(value);

        if (this.optionComponents) {
            this.optionComponents.forEach((selectOptionComponent) => {
                selectOptionComponent.updateSelected(value);
            });
        }
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
            this.scrollToValue(value);
        }

        this.writeValue(value);
        this.change.emit(this.ngModel);
    }

    private scrollToValue(value: any) {
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
