import * as React from 'react';
import { cn } from '@/lib/utils';

interface WithForwardRefProps {
  className?: string;
}

export function withForwardRef<
  T,
  P extends WithForwardRefProps & { ref?: React.Ref<T> }
>(
  WrappedComponent: React.ComponentType<P>,
  displayName: string,
  defaultClassName?: string
) {
  const WithForwardRefComponent = React.forwardRef<T, Omit<P, 'ref'>>((props, ref) => {
    const { className, ...restProps } = props;
    return (
      <WrappedComponent
        {...(restProps as P)}
        ref={ref}
        className={cn(defaultClassName, className)}
      />
    );
  });

  WithForwardRefComponent.displayName = displayName;
  return WithForwardRefComponent;
} 