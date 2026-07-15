import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { UserRoute } from './user';

export const routes: Routes = [
  {
    path: 'users',
    children: [UserRoute],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PostsModule {}
