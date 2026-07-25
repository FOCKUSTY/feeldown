import { convertToRouteModule } from '@/utils/load-module';

export const ProfileRoute = convertToRouteModule(import('./profile.module'));
export default ProfileRoute;
