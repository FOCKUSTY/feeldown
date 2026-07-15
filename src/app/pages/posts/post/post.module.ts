import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { Post } from './post.component';
import { postResolver } from './post.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: Post,
    resolve: { post: postResolver }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PostModule {}
