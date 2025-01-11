export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WithAsChildProps extends BaseComponentProps {
  asChild?: boolean;
}

export interface WithInsetProps extends BaseComponentProps {
  inset?: boolean;
} 