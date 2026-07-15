import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { PostService } from '@/app/services';
import { ClientPost } from '@/server/types';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap, catchError, of } from 'rxjs';

export const setPostMetaTags = (post: ClientPost, title: Title, meta: Meta): void => {
  const titleText = `${post.user.name} — Feeldown`;
  title.setTitle(titleText);

  const plainText = post.content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();

  const description = plainText.slice(0, 160) + (plainText.length > 160 ? '…' : '');
  const url = `https://feeldown.vercel.app/posts/${post.id}`;
  const image = 'https://feeldown.vercel.app/og-image.png';

  meta.removeTag('name="description"');
  meta.removeTag('property="og:title"');
  meta.removeTag('property="og:description"');
  meta.removeTag('property="og:image"');
  meta.removeTag('property="og:url"');
  meta.removeTag('property="og:type"');
  meta.removeTag('name="twitter:card"');
  meta.removeTag('name="twitter:title"');
  meta.removeTag('name="twitter:description"');
  meta.removeTag('name="twitter:image"');

  meta.addTag({ name: 'description', content: description });
  meta.addTag({ property: 'og:title', content: titleText });
  meta.addTag({ property: 'og:description', content: description });
  meta.addTag({ property: 'og:image', content: image });
  meta.addTag({ property: 'og:url', content: url });
  meta.addTag({ property: 'og:type', content: 'article' });
  meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
  meta.addTag({ name: 'twitter:title', content: titleText });
  meta.addTag({ name: 'twitter:description', content: description });
  meta.addTag({ name: 'twitter:image', content: image });
}

export const postResolver: ResolveFn<ClientPost | null> = (
  route: ActivatedRouteSnapshot
): Observable<ClientPost | null> => {
  const postService = inject(PostService);
  const title = inject(Title);
  const meta = inject(Meta);

  const id = route.paramMap.get('id');
  if (!id) {
    return of(null);
  }

  return postService.get(id).pipe(
    tap(post => setPostMetaTags(post, title, meta)),
    catchError(() => {
      title.setTitle('Пост не найден | Feeldown');
      return of(null);
    })
  );
};
