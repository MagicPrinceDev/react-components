import { ReactNode } from 'react';

export type RlsTheme =
  | 'standard'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'amaizing'
  | 'smartness'
  | 'obsidian';

export interface RlsComponent {
  children?: ReactNode;
  rlsTheme?: RlsTheme;
}
