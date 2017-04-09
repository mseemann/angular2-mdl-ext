import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdlDatePickerModule } from './index';
import { CommonModule } from '@angular/common';
import { MdlButtonModule, MdlIconModule, MdlRippleModule } from '@angular-mdl/core';

describe('DatePicker', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MdlButtonModule,
        MdlIconModule,
        MdlRippleModule,
        MdlDatePickerModule
      ],
      declarations: [],
    });

  });

  it('should do nothing', () => {
    expect(true).toBe(true);
  });

});
