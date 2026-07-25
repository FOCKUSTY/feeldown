import { Routes } from '@angular/router';

import { HomeRoute } from './home';
import { PostsRoute } from './posts';
import { UsersRoute } from './users';
import { ProfileRoute } from './profile';

export const PagesRoutes: Routes = [
  HomeRoute,
  PostsRoute,
  UsersRoute,
  ProfileRoute,
];
