import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import styles from './Input.module.css';

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
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className={styles.label}
        >
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <span className={styles.iconLeft}>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          className={cn(
            styles.input,
            error && styles.error,
            leftIcon && styles.hasLeftIcon,
            rightIcon && styles.hasRightIcon,
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className={styles.iconRight}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
