type HTMLRolsterAttributes = React.HTMLAttributes<HTMLElement>;
type HTMLRolsterElement = React.DetailedHTMLProps<
  HTMLRolsterAttributes,
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'rls-amount': HTMLRolsterElement;
      'rls-avatar': HTMLRolsterElement;
    }
  }
}

export {};
