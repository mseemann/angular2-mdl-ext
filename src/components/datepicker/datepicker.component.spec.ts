import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdlDatePickerModule } from './index';

describe('DatePicker', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MdlDatePickerModule],
      declarations: [],
    });

  });

  it('should do nothing', () => {
    expect(true).toBe(true);
  });

});
