import { convertToRouteModule } from '@/utils/load-module';

export const EditRoute = convertToRouteModule(import('./edit.module'));
export default EditRoute;
