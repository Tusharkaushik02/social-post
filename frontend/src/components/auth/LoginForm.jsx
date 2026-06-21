import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { IoEyeOffOutline, IoEyeOutline, IoLockClosedOutline, IoMailOutline, IoArrowForward } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginForm({ onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const googleBtnRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    clearError();
    try {
      await login(values);
      toast.success('Welcome back');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleCredential = useCallback(async (response) => {
    try {
      await loginWithGoogle(response.credential);
      toast.success('Welcome back');
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
          width: 300,
          text: 'signin_with',
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
          label="Email address"
          type="email"
          placeholder="Email address"
          autoComplete="email"
          leftIcon={<IoMailOutline size={18} />}
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="current-password"
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
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => toast('Password reset link has been simulated.')}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-on-surface-variant)',
                transition: 'color 0.2s',
                cursor: 'pointer',
                textAlign: 'right',
                alignSelf: 'flex-end',
              }}
            >
              Forgot password?
            </button>
          </div>
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
          Log in
        </Button>
      </form>

      {/* Redirect footer */}
      <div className="auth-footer">
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="auth-footer-link"
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
