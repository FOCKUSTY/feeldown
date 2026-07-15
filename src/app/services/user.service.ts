import type { User, Data } from "@/server/types";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpBaseSerive } from "./http-base.service";

@Injectable({ providedIn: "root" })
export class UserService extends HttpBaseSerive {
  public constructor(
    private readonly http: HttpClient
  ) {
    super()
  }

  public get(token?: string | null) {
    const data = this.http.get<Data<User|null>>("/api/user", {
      responseType: "json",
      headers: this.getHeaders(token)
    });

    return this.from(data);
  }
}
