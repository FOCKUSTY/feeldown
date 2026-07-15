import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

import { NewRoute } from './new';
import { PostRoute } from './post';
import { EditRoute } from './edit';

export const routes: Routes = [
  {
    path: 'posts',
    children: [NewRoute, PostRoute, EditRoute],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PostsModule {}
