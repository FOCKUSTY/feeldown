import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { Post } from './post.component';
import { PostResolver } from './post.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: Post,
    resolve: { post: PostResolver }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PostModule {}
