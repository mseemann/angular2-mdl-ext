# Select

### Installing

    npm i --save @angular2-mdl-ext/popover @angular2-mdl-ext/select

    import { MdlSelectModule } from '@angular2-mdl-ext/select';

### Usage example

    <mdl-select [(ngModel)]="personId">
      <mdl-option *ngFor="let p of people" [value]="p.id">{{p.name}}</mdl-option>
    </mdl-select>

### API Summary

#### mdl-select

| Name | Type | Description |
| --- | --- | --- |
| `[ngModel]` | any | Select data binding
| `[disabled]` | boolean | Whether or not the select is disabled
| `[placeholder]` | string | Placeholder text
| `[multiple]` | boolean | Multiselect mode

#### mdl-option

| Name | Type | Description |
| --- | --- | --- |
| `[value]` | any | Option value
| `<content>` | string | Option label
