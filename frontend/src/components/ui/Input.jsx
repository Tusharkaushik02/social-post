import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(function Input(
  {
    label,
    error,
    leftIcon,
    rightIcon,
    fullWidth = true,
    className = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-label-md font-semibold text-on-surface-variant"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 flex items-center justify-center text-on-surface-variant">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'h-12 w-full rounded-sm border-none bg-surface-container-low py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-200 focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary/20',
            leftIcon ? 'pl-11' : 'pl-4',
            rightIcon ? 'pr-12' : 'pr-4',
            error && 'bg-error-container/10 text-on-surface focus:ring-error/20',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 flex items-center justify-center text-on-surface-variant">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="animate-fade-in text-label-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
