import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'posts/new',
    renderMode: RenderMode.Server,
  },
  {
    path: 'posts/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'users/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
