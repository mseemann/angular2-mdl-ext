import { Component } from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  FormGroup,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'select-demo',
  templateUrl: 'select.component.html'
})
export class SelectDemo {
  form: FormGroup;

  personId: FormControl = new FormControl(1);
  people: any[] = [
    {id: 1, name: 'Bryan Cranston'},
    {id: 2, name: 'Aaron Paul'},
    {id: 3, name: 'Bob Odenkirk'},
  ];

  countryCode: string = 'FR';
  countryCodes: string[] = ['FR', 'DE', 'IT'];
  countries: any = [
    {name: 'France', code: 'FR'},
    {name: 'Germany', code: 'DE'},
    {name: 'Italy', code: 'IT'},
    {name: 'Netherlands', code: 'NL'},
    {name: 'Poland', code: 'PL'},
    {name: 'Spain', code: 'ES'},
    {name: 'United Kingdom', code: 'UK'},
  ];

  foodCategories: any[] = [
    {id: '1', name: 'Vegetables'},
    {id: '2', name: 'Fruits'},
  ];

  foodByCategory: any = {
    '1': [
      'Avocado', 'Beet', 'Broccoli', 'Carrot', 'Cucumber',
      'Onion', 'Potato', 'Pumpkin', 'Radish', 'Spinach'
    ],
    '2': [
      'Apple', 'Banana', 'Cherry', 'Grapes', 'Orange',
      'Peach', 'Pear', 'Pineapple', 'Plum', 'Strawberry'
    ]
  };
  food: string[];

  ngOnInit() {
    this.form = new FormGroup({
      personId: this.personId
    });

    this.personId.valueChanges
      .subscribe((value: any) => {
        console.log('personId.valueChanges', value);
      });
  }

  onChange(value: any) {
    console.log('onChange', value);
  }
}
