import { ReactNode } from 'react';

export type RlsTheme =
  | 'rolster'
  | 'success'
  | 'info'
  | 'happy'
  | 'warning'
  | 'danger';

export interface RlsComponent {
  children?: ReactNode;
  rlsTheme?: RlsTheme;
}
