"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var SelectDemo = (function () {
    function SelectDemo() {
        this.personId = new forms_1.FormControl(1);
        this.people = [
            { id: 1, name: 'Bryan Cranston' },
            { id: 2, name: 'Aaron Paul' },
            { id: 3, name: 'Bob Odenkirk' },
        ];
        this.countryCode = 'FR';
        this.countryCodes = ['FR', 'DE', 'IT'];
        this.countries = [
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'Italy', code: 'IT' },
            { name: 'Netherlands', code: 'NL' },
            { name: 'Poland', code: 'PL' },
            { name: 'Spain', code: 'ES' },
            { name: 'United Kingdom', code: 'UK' },
        ];
        this.foodCategories = [
            { id: '1', name: 'Vegetables' },
            { id: '2', name: 'Fruits' },
        ];
        this.foodByCategory = {
            '1': [
                'Avocado', 'Beet', 'Broccoli', 'Carrot', 'Cucumber',
                'Onion', 'Potato', 'Pumpkin', 'Radish', 'Spinach'
            ],
            '2': [
                'Apple', 'Banana', 'Cherry', 'Grapes', 'Orange',
                'Peach', 'Pear', 'Pineapple', 'Plum', 'Strawberry'
            ]
        };
    }
    SelectDemo.prototype.ngOnInit = function () {
        this.form = new forms_1.FormGroup({
            personId: this.personId
        });
        this.personId.valueChanges
            .subscribe(function (value) {
            console.log('personId.valueChanges', value);
        });
    };
    SelectDemo.prototype.onChange = function (value) {
        console.log('onChange', value);
    };
    return SelectDemo;
}());
SelectDemo = __decorate([
    core_1.Component({
        selector: 'select-demo',
        templateUrl: 'select.component.html',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    })
], SelectDemo);
exports.SelectDemo = SelectDemo;
//# sourceMappingURL=select.component.js.map