import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { NewRoute } from './new';
import { HomeRoute } from './home';
import { PostRoute } from './post';

export const routes: Routes = [
  {
    path: 'posts',
    children: [HomeRoute, NewRoute, PostRoute],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PostsModule {}
