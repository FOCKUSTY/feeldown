import {
  bootstrapTelegram,
  bootstrapGithub,
  bootstrapBluesky,
  bootstrapGlobe,
} from '@ng-icons/bootstrap-icons';

export const LINKS: Record<string, string> = {
  telegram: bootstrapTelegram,
  github: bootstrapGithub,
  bluesky: bootstrapBluesky,
};

export const DEFAULT = bootstrapGlobe;

export const getLink = (link: string) => {
  return LINKS[link] || DEFAULT;
};
