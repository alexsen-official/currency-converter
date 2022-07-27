import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';

import { Code, Exchange } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  readonly apiUrl = 'https://api.exchangerate.host/latest';

  constructor(private readonly _httpClient: HttpClient) {

  }

  get(bases: Code[], rates: Code[]) {
    let result = new Observable<Exchange>();

    for (const base of bases) {
      const params = {
        base,
        symbols: rates.join()
      };

      this._httpClient
          .get<Exchange>(this.apiUrl, { params })
          .pipe(i => result = merge(result, i));
    }

    return result;
  }
}
