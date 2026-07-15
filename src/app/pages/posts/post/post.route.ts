import { convertToRouteModule } from '@/utils/load-module';

export const PostRoute = convertToRouteModule(import('./post.module'));
export default PostRoute;
