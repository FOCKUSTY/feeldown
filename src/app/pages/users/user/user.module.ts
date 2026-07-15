import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { Home } from './user.component';

const routes: Routes = [
  {
    path: ':slug',
    component: Home,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class HomeModule {}
