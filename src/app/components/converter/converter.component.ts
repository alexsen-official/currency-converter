import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ExchangeService } from '../../services';
import { Code, Exchange } from '../../types';
import { numericOnlyValidator } from '../../validators';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {
  readonly form = new FormGroup({
    from: new FormGroup({
      code: new FormControl(Code.USD, []),
      amount: new FormControl(0, [
        Validators.required,
        numericOnlyValidator()
      ])
    }),

    to: new FormGroup({
      code: new FormControl(Code.UAH, []),
      amount: new FormControl(0, [
        Validators.required,
        numericOnlyValidator()
      ])
    })
  });

  rate = 0;
  exchange!: Exchange;

  private readonly _subscription = new Subscription();

  constructor(private readonly _exchangeService: ExchangeService) {

  }

  // region Getters

  get from() {
    return this.form.controls.from as FormGroup;
  }

  get to() {
    return this.form.controls.to as FormGroup;
  }

  get fromCode() {
    return this.from.get('code') as FormControl;
  }

  get fromAmount() {
    return this.from.get('amount') as FormControl;
  }

  get toCode() {
    return this.to.get('code') as FormControl;
  }

  get toAmount() {
    return this.to.get('amount') as FormControl;
  }

  //endregion

  ngOnInit() {
    this.fetchExchange();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  fetchExchange(callback?: Function) {
    this.form.disable();

    this._subscription.add(
      this._exchangeService
          .get([this.toCode.value], [this.fromCode.value])
          .subscribe({
            next: value => {
              this.exchange = value;
              this.rate = value.rates[this.fromCode.value as Code] || 0;

              callback?.bind(this)?.();
              this.form.enable();
            },
            error: error => {
              console.error(error.message);
              this.form.enable();
            }
          })
    );
  }

  round(number: number, decimalPlaces: number = 2) {
    if (isNaN(number)) {
      return 0;
    }

    const factor = Math.pow(10, decimalPlaces);
    return Math.round((number + Number.EPSILON) * factor) / factor;
  }

  buy() {
    const value = this.fromAmount.value * (1 / this.rate);
    this.toAmount.setValue(this.round(value));
  }

  sell() {
    const value = this.toAmount.value * this.rate;
    this.fromAmount.setValue(this.round(value));
  }
}
