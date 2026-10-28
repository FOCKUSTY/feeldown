import type { AuthParameters, GroupedAuthParameters } from '../types';

export const PROVIDERS = ['google', 'github'] as const;

export const AUTH_BASE_PARAMETERS = [
  'CLIENT_ID',
  'CLIENT_SECRET',
  'CALLBACK_URL',
] as const;

export const AUTH_PARAMETERS = PROVIDERS.flatMap((provider) => {
  return AUTH_BASE_PARAMETERS.flatMap((parameter) => {
    return `${provider.toUpperCase()}_${parameter}`;
  });
}) as AuthParameters[];

export const GROUPED_AUTH_PARAMETERS: GroupedAuthParameters = (() => {
  const entries = PROVIDERS.map((provider) => {
    const parametersEntries = AUTH_BASE_PARAMETERS.map((parameter) => {
      const key = `${provider.toUpperCase()}_${parameter}` as AuthParameters;
      return [parameter, process.env[key]];
    });

    const parameters = Object.fromEntries(parametersEntries);
    return [provider, parameters];
  });

  return Object.fromEntries(entries);
})();
