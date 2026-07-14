import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

import { useLayout } from '@/utils/use-layout';
import { PagesRoutes } from './pages';
import { Layouts } from './layouts';

export const routes: Routes = [
  useLayout({
    layout: Layouts.NoLayout,
    routes: PagesRoutes,
  }),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppModule {}
