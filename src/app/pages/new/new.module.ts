import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { New } from './new.component';

const routes: Routes = [
  {
    path: 'new',
    component: New,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class NewModule {}
