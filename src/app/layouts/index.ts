import { NoLayout } from './nolayout/nolayout.component';

export const Layouts = {
  NoLayout,
} as const;

export type Layouts = (typeof Layouts)[keyof typeof Layouts];
