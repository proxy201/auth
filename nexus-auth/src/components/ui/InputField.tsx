'use client';

import { forwardRef, useState, useId } from 'react';
import clsx from 'clsx';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label:     string;
  error?:    string;
  hint?:     string;
  leftIcon?: React.ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, leftIcon, type, className, ...props }, ref) => {
    const uid              = useId();
    const [show, setShow]  = useState(false);
    const isPassword       = type === 'password';
    const resolvedType     = isPassword ? (show ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={uid} className="label">
          {label}
        </label>

        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="field-icon">{leftIcon}</span>
          )}

          <input
            id={uid}
            ref={ref}
            type={resolvedType}
            className={clsx(
              'glass-input',
              leftIcon       ? ''                    : 'glass-input-no-pad-left',
              isPassword     ? 'glass-input-pr'      : '',
              error          ? 'has-error'           : '',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${uid}-err` : undefined}
            {...props}
          />

          {/* Toggle password visibility */}
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShow((s) => !s)}
              className="field-icon-right"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <span id={`${uid}-err`} className="error-text" role="alert">
            <FiAlertCircle size={13} style={{ flexShrink: 0, color: '#f87171' }} />
            {error}
          </span>
        )}

        {/* Hint (shown only when no error) */}
        {hint && !error && (
          <span className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>
            {hint}
          </span>
        )}
      </div>
    );
  },
);

InputField.displayName = 'InputField';
export default InputField;
