import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
  IoMailOutline,
  IoPersonOutline,
  IoArrowForward,
} from 'react-icons/io5';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Use letters, numbers, and underscores only'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Compute password strength on a 0-4 scale.
 * 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong.
 */
function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_COLORS = {
  0: 'var(--color-surface-variant)',
  1: '#ef4444',
  2: '#eab308',
  3: '#10b981',
  4: '#10b981',
};

const STRENGTH_LABELS = {
  0: '',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
};

const STRENGTH_LABEL_COLORS = {
  0: '',
  1: '#ef4444',
  2: '#eab308',
  3: '#10b981',
  4: '#10b981',
};

export default function RegisterForm({ onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const { register: signup, isLoading, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const passwordValue = watch('password', '');
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = async (values) => {
    clearError();
    try {
      await signup(values);
      toast.success('Account created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Social Logins */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          type="button"
          className="auth-social-btn"
          onClick={() => toast('Google signup is ready for setup.')}
        >
          <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          className="auth-social-btn apple-btn"
          onClick={() => toast('Apple signup is ready for setup.')}
        >
          <svg style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.365 7.185c.983-1.196 1.644-2.855 1.464-4.523-1.43.058-3.148.95-4.153 2.144-.897 1.054-1.666 2.75-1.462 4.382 1.597.123 3.167-.803 4.151-2.003zM16.592 11.455c-.035-2.482 2.029-3.692 2.122-3.75-1.15-1.682-2.943-1.91-3.58-1.942-1.523-.153-2.977.896-3.75.896-.773 0-1.961-.875-3.218-.85-1.616.023-3.109.94-3.94 2.384-1.682 2.915-.43 7.234 1.206 9.596.804 1.153 1.745 2.448 3.003 2.397 1.205-.05 1.66-.78 3.106-.78 1.444 0 1.866.78 3.125.755 1.298-.024 2.11-1.173 2.903-2.333.916-1.336 1.295-2.628 1.315-2.695-.03-.013-2.488-.954-2.292-3.678z"></path>
          </svg>
          Continue with Apple
        </button>
      </div>

      {/* Divider */}
      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span className="auth-divider-text">or</span>
        <div className="auth-divider-line" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
        {error && (
          <div
            role="alert"
            className="animate-fade-in"
            style={{
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(186, 26, 26, 0.2)',
              background: 'rgba(186, 26, 26, 0.08)',
              padding: 12,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-error)',
            }}
          >
            {error}
          </div>
        )}

        <Input
          label="Username"
          type="text"
          placeholder="Choose a username"
          autoComplete="username"
          leftIcon={<IoPersonOutline size={18} />}
          error={errors.username?.message}
          disabled={isLoading}
          {...register('username')}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="Email address"
          autoComplete="email"
          leftIcon={<IoMailOutline size={18} />}
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="new-password"
            leftIcon={<IoLockClosedOutline size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: 6,
                  color: 'var(--color-on-surface-variant)',
                  transition: 'color 0.2s',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            }
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
          />

          {/* Password Strength Bar */}
          {passwordValue.length > 0 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="strength-bar">
                {[1, 2, 3, 4].map((segment) => (
                  <div
                    key={segment}
                    className="strength-segment"
                    style={{
                      background: segment <= strength ? STRENGTH_COLORS[strength] : undefined,
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>
              {STRENGTH_LABELS[strength] && (
                <span
                  className="text-label-sm"
                  style={{ color: STRENGTH_LABEL_COLORS[strength] }}
                >
                  {STRENGTH_LABELS[strength]}
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className="btn-lg"
          style={{ marginTop: 8 }}
          rightIcon={<IoArrowForward size={18} />}
        >
          Sign up
        </Button>
      </form>

      {/* Redirect footer */}
      <div className="auth-footer">
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="auth-footer-link"
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
