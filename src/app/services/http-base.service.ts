import type { Data } from '@/server/types';
import type { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export abstract class HttpBaseSerive {
  protected readonly cookie = inject(CookieService);

  public constructor() {}

  protected from<T>(observable: Observable<Data<T>>) {
    return observable.pipe(
      map((value) => {
        return value.data;
      }),
    );
  }

  protected getHeaders(token?: string | null) {
    const tempToken = token || this.cookie.get('token');
    const authorizationString = (() => {
      if (!tempToken) {
        return '';
      }

      if (tempToken === 'undefined') {
        return '';
      }

      return `Bearer ${tempToken}`;
    })();

    return {
      authorization: authorizationString,
    };
  }
}
