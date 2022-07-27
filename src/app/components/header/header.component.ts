import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ExchangeService } from '../../services';
import { Code, Exchange } from '../../types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() title = '';

  isLoading = true;
  exchanges: Exchange[] = [];

  private readonly _subscription = new Subscription();

  constructor(private readonly _exchangeService: ExchangeService) {

  }

  ngOnInit() {
    this.fetchExchanges();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  fetchExchanges() {
    this.isLoading = true;

    this._subscription.add(
      this._exchangeService
          .get([Code.USD, Code.EUR], [Code.UAH])
          .subscribe({
            next: value => {
              this.exchanges.push(value);
              this.isLoading = false;
            },
            error: error => {
              console.error(error.message);
              this.isLoading = false;
            }
          })
    );
  }
}
