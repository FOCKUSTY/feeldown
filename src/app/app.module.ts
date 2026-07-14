import { RouterModule, Routes } from "@angular/router";

import { NgModule } from "@angular/core";
import { Layouts } from "./layouts";
import { useLayout } from "../utils/use-layout";


export const routes: Routes = [
  useLayout({
    layout: Layouts.NoLayout,
    routes: [],
  }),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppModule {}
