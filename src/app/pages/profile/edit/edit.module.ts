import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProfileEdit } from './edit.component';

const routes: Routes = [
  {
    path: 'edit',
    component: ProfileEdit,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export default class ProfileEditModule {}
