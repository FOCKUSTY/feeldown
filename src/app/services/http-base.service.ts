import type { Data } from '@/server/types';
import type { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { decompressFromBase64 } from 'lz-string';

export abstract class HttpBaseService {
  protected readonly cookie = inject(CookieService);

  public constructor() {}

  protected from<T>(observable: Observable<Data<T>>) {
    return observable.pipe(
      map((value) => {
        return value.data;
      }),
    );
  }

  protected decompress<T, K extends keyof NonNullable<T>>(
    observable: Observable<T>,
    key: K,
  ): Observable<T> {
    return observable.pipe(
      map((value) => {
        if (!value) {
          return null as T;
        }

        return {
          ...value,
          [key]: decompressFromBase64(value[key] as string),
        };
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
