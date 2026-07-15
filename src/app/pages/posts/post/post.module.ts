import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { Post } from './post.component';

const routes: Routes = [
  {
    path: ':id',
    component: Post,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PostModule {}
