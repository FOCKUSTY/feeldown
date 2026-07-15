import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditPost } from './edit.component';

const routes: Routes = [
  {
    path: ':id/edit',
    component: EditPost,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class EditModule {}
