// post.resolver.ts
import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { PostService } from '@/app/services';
import { ClientPost } from '@/server/types';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostResolver implements Resolve<ClientPost> {
  private readonly postService = inject(PostService);

  public constructor(
    private title: Title,
    private meta: Meta
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<ClientPost> {
    const id = route.paramMap.get('id')!;
    return this.postService.get(id).pipe(
      tap(post => this.setMeta(post))
    );
  }

  private setMeta(post: ClientPost): void {
    const title = `${post.user.name} — Feeldown`;
    this.title.setTitle(title);

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

    this.meta.addTag({ name: 'description', content: description });
    this.meta.addTag({ property: 'og:title', content: title });
    this.meta.addTag({ property: 'og:description', content: description });
    this.meta.addTag({ property: 'og:image', content: image });
    this.meta.addTag({ property: 'og:url', content: url });
    this.meta.addTag({ property: 'og:type', content: 'article' });
    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:title', content: title });
    this.meta.addTag({ name: 'twitter:description', content: description });
    this.meta.addTag({ name: 'twitter:image', content: image });
  }
}
