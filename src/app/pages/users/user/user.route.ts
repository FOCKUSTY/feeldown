import { convertToRouteModule } from '@/utils/load-module';

export const UserRoute = convertToRouteModule(import('./user.module'));
export default UserRoute;
