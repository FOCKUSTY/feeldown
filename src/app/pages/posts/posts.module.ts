import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { NewRoute } from './new';
import { HomeRoute } from './home';

export const routes: Routes = [
  {
    path: 'posts',
    children: [HomeRoute, NewRoute],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PostsModule {}
