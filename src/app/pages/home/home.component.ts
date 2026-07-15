import { AuthService, UserService } from '@/app/services';
import { User } from '@/server/types';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
})
export class Home {
  private readonly _route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  protected readonly _token = signal<string | null>(null);
  protected readonly _user = signal<User | null>(null);
  protected readonly _loaded = signal<boolean>(false);

  private _subscription = new Subscription();

  public constructor() {}

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

  public setToken(token?: string) {
    if (!token) {
      return null;
    }

    if (token === 'undefined') {
      return null;
    }

    this.authService.setToken(token);
    this._token.set(token);
    return token;
  }

  public getUser(token?: string) {
    return this.userService.get(token);
  }
}
