import { ReactNode } from 'react';

export type RlsTheme =
  | 'primary'
  | 'success'
  | 'info'
  | 'happy'
  | 'warning'
  | 'danger'
  | 'coffee'
  | 'obsidian';

export interface RlsComponent {
  children?: ReactNode;
  rlsTheme?: RlsTheme;
}
