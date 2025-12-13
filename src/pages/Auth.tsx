import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { CheckSquare, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from '@/lib/auth-validation';

// Mock auth - will be replaced with Lovable Cloud
const mockAuth = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'demo@example.com' && password === 'Password123') {
      localStorage.setItem('auth_token', 'mock_jwt_token');
      localStorage.setItem('user', JSON.stringify({ email, name: 'Demo User' }));
      return { success: true };
    }
    throw new Error('Invalid email or password');
  },
  signup: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'demo@example.com') {
      throw new Error('Email already registered');
    }
    localStorage.setItem('auth_token', 'mock_jwt_token');
    localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
    return { success: true };
  },
};

type AuthMode = 'login' | 'signup';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });

  const validateForm = () => {
    try {
      if (mode === 'login') {
        loginSchema.parse(loginData);
      } else {
        signupSchema.parse(signupData);
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await mockAuth.login(loginData.email, loginData.password);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
      } else {
        await mockAuth.signup(signupData.email, signupData.password);
        toast({
          title: 'Account created!',
          description: 'Welcome to TaskFlow.',
        });
      }
      navigate('/');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
              <CheckSquare className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">TaskFlow</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Organize your work,<br />
              simplify your life
            </h1>
            <p className="text-lg text-primary-foreground/80">
              A modern task management platform designed for teams who ship fast.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
            <span>Trusted by 10,000+ teams</span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/50" />
            <span>Enterprise ready</span>
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <CheckSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">TaskFlow</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {mode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Start organizing your tasks in minutes'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={mode === 'login' ? loginData.email : signupData.email}
                onChange={(e) => {
                  if (mode === 'login') {
                    setLoginData({ ...loginData, email: e.target.value });
                  } else {
                    setSignupData({ ...signupData, email: e.target.value });
                  }
                }}
                error={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
                value={mode === 'login' ? loginData.password : signupData.password}
                onChange={(e) => {
                  if (mode === 'login') {
                    setLoginData({ ...loginData, password: e.target.value });
                  } else {
                    setSignupData({ ...signupData, password: e.target.value });
                  }
                }}
                error={!!errors.password}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  error={!!errors.confirmPassword}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              loading={loading}
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button 
                type="button"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => toast({ title: 'Coming soon', description: 'Password reset will be available with Lovable Cloud' })}
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary font-medium hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo:</strong> demo@example.com / Password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
