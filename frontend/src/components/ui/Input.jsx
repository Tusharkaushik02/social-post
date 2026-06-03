import { forwardRef } from 'react';

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

  const inputClasses = `input-field${leftIcon ? ' input-with-icon-left' : ''}${rightIcon ? ' input-with-icon-right' : ''}${error ? ' has-error' : ''} ${className}`.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label
          htmlFor={inputId}
          className="input-label"
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <span className="input-icon-left">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <span className="input-icon-right">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="input-error animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
