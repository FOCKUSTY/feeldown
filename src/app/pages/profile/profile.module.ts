import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

import { EditRoute } from './edit';
import { HomeRoute } from './home';

export const routes: Routes = [
  {
    path: 'profile',
    children: [HomeRoute, EditRoute],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class PostsModule {}
