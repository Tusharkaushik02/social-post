import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

export default function LoginForm({ onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Social Logins */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-sm bg-surface-container-low hover:bg-surface-container-high transition-all text-on-surface font-label-md text-label-md border-[0.5px] border-outline-variant/50 active:scale-[0.98] cursor-pointer"
          onClick={() => toast('Google authentication is ready for setup.')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-sm bg-primary text-on-primary hover:opacity-90 transition-all font-label-md text-label-md active:scale-[0.98] cursor-pointer"
          onClick={() => toast('Apple authentication is ready for setup.')}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.365 7.185c.983-1.196 1.644-2.855 1.464-4.523-1.43.058-3.148.95-4.153 2.144-.897 1.054-1.666 2.75-1.462 4.382 1.597.123 3.167-.803 4.151-2.003zM16.592 11.455c-.035-2.482 2.029-3.692 2.122-3.75-1.15-1.682-2.943-1.91-3.58-1.942-1.523-.153-2.977.896-3.75.896-.773 0-1.961-.875-3.218-.85-1.616.023-3.109.94-3.94 2.384-1.682 2.915-.43 7.234 1.206 9.596.804 1.153 1.745 2.448 3.003 2.397 1.205-.05 1.66-.78 3.106-.78 1.444 0 1.866.78 3.125.755 1.298-.024 2.11-1.173 2.903-2.333.916-1.336 1.295-2.628 1.315-2.695-.03-.013-2.488-.954-2.292-3.678z"></path>
          </svg>
          Continue with Apple
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-[0.5px] flex-1 bg-outline-variant/30"></div>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">or</span>
        <div className="h-[0.5px] flex-1 bg-outline-variant/30"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {error && (
          <div className="rounded-sm border border-error-container/20 bg-error-container/10 p-3 text-center text-label-md text-error">
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

        <div className="flex flex-col gap-1.5 w-full">
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
                className="rounded-full p-1 text-on-surface-variant hover:text-on-surface"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            }
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => toast('Password reset link has been simulated.')}
              className="text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-right self-end"
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
          className="h-12 mt-2 rounded-sm"
          rightIcon={<IoArrowForward size={18} />}
        >
          Log in
        </Button>
      </form>

      {/* Redirect footer */}
      <div className="text-center pt-4 border-t-[0.5px] border-outline-variant/30">
        <p className="text-body-md text-on-surface-variant">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-primary hover:underline decoration-1 underline-offset-4 cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
