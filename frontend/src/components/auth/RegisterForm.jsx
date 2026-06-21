import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const navigate = useNavigate();
  const { register: signup, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const googleBtnRef = useRef(null);
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
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleGoogleCredential = useCallback(async (response) => {
    try {
      await loginWithGoogle(response.credential);
      toast.success('Welcome to social post');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Google Sign In failed');
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;
    if (window.google?.accounts?.id) {
      setIsGoogleReady(true);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        setIsGoogleReady(true);
        window.clearInterval(intervalId);
      }
    }, 100);

    const timeoutId = window.setTimeout(() => window.clearInterval(intervalId), 5000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (GOOGLE_CLIENT_ID && isGoogleReady && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });
        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signup_with',
        });
      } catch (err) {
        console.error('[Google Button Render Error]', err);
      }
    }
  }, [handleGoogleCredential, isGoogleReady]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Social Logins */}
      {GOOGLE_CLIENT_ID && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div ref={googleBtnRef} style={{ width: '100%', minHeight: '40px' }} />
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>
        </>
      )}

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
