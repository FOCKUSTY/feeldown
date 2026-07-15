import { convertToRouteModule } from '@/utils/load-module';

export const NewRoute = convertToRouteModule(import('./new.module'));
export default NewRoute;
