import { getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Code } from '../../types';

@Component({
  selector: 'app-currency-input[control]',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss']
})
export class CurrencyInputComponent {
  @Input() control!: FormControl;
  @Input() currencyCode = Code.USD;

  @Output() onChange = new EventEmitter();

  getCurrencySymbol() {
    return getCurrencySymbol(this.currencyCode, 'narrow');
  }
}
