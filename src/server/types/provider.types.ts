import type { AUTH_BASE_PARAMETERS, PROVIDERS } from '../constants';

export type Provider = (typeof PROVIDERS)[number];
export type AuthBaseParameters = (typeof AUTH_BASE_PARAMETERS)[number];
export type AuthParameters = `${Uppercase<Provider>}_${AuthBaseParameters}`;
export type GroupedAuthParameters = {
  [P in Provider]: Record<AuthBaseParameters, string>;
};
