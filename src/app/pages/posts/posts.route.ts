import { convertToRouteModule } from '@/utils/load-module';

export const PostsRoute = convertToRouteModule(import('./posts.module'));
export default PostsRoute;
