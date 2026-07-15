import { convertToRouteModule } from '@/utils/load-module';

export const UsersRoute = convertToRouteModule(import('./users.module'));
export default UsersRoute;
