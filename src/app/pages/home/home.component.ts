import type { User } from '@/server/types';
import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription, switchMap, tap } from 'rxjs';

import { AuthService, UserService } from '@/app/services';
import { environment } from '@/environments/environment';
import { TvButton } from "@/app/components/fd-button/fd-button.component";

@Component({
  selector: 'app-home',
  imports: [TvButton],
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  private readonly _route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  protected readonly _token = signal<string | null>(null);
  protected readonly _user = signal<User | null>(null);
  protected readonly _loaded = signal<boolean>(false);

  protected readonly _login_url = `${environment.API_ORIGIN}/api/auth/google`;

  private _subscription = new Subscription();

  public ngOnInit() {
    this._subscription = this._route.queryParams
      .pipe(
        map((query) => query['token']),
        tap((token) => this.setToken(token)),
        switchMap((token) => this.getUser(token)),
      )
      .subscribe((user) => {
        this._user.set(user);
        this._loaded.set(true);
      });
  }

  public ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private setToken(token?: string): void {
    if (!token || token === 'undefined') return;
    this.authService.setToken(token);
    this._token.set(token);
  }

  private getUser(token?: string) {
    return this.userService.get(token);
  }
}
