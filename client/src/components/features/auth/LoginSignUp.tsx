import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { InitialOnboarding, OnboardingData } from '../onboarding/InitialOnboarding';
import { WillingToQuitModal } from '../onboarding/WillingToQuitModal';

interface LoginSignUpProps {
  onLogin: (userType: 'admin' | 'standard') => void;
  onSignUp: () => void;
  onBackToLanding: () => void;
}

export function LoginSignUp({ onLogin, onSignUp, onBackToLanding }: LoginSignUpProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [stage, setStage] = useState<'auth' | 'onboarding'>('auth');
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [showWillingToQuitModal, setShowWillingToQuitModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Load Google Sign-In script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (typeof window !== 'undefined' && !window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.head.appendChild(script);
      } else if (typeof window !== 'undefined' && window.google) {
        initializeGoogleSignIn();
      }
    };

    const initializeGoogleSignIn = () => {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Render the Google Sign-In button
        renderGoogleButton();
      }
    };

    const renderGoogleButton = () => {
      const buttonContainer = document.getElementById('google-signin-button');
      if (buttonContainer) {
        buttonContainer.innerHTML = '';
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          text: isLogin ? 'signin_with' : 'signup_with',
          width: 400,
          shape: 'rectangular'
        });
      }
    };

    loadGoogleScript();

    // Re-render button when switching between login/signup
    if (window.google) {
      renderGoogleButton();
    }
  }, [isLogin]);

  const handleGoogleSignIn = async (response: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Google authentication failed');

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      const userType: 'admin' | 'standard' = data?.user?.role === 'admin' ? 'admin' : 'standard';

      // Redirect admins to admin dashboard
      if (userType === 'admin') {
        router.push('/admin');
        return;
      }

      // Handle new user vs existing user
      if (data.isNewUser) {
        // For new Google users, start onboarding
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('signupEmail', data.user.email);
          sessionStorage.setItem('signupFullName', data.user.profile?.full_name || '');
          sessionStorage.setItem('googleSignup', 'true');
        }
        setStage('onboarding');
        return;
      }

      // Onboarding redirect guard for existing users
      const requires = !!data?.requiresOnboarding;
      const step = typeof data?.currentStep === 'number' ? data.currentStep : 0;

      if (requires) {
        const stepRoutes: { [key: number]: string } = {
          0: '/5a/ask',
          1: '/5a/advise',
          2: '/5a/assess',
          3: '/5a/assist'
        };

        // If user hasn't started onboarding (step 0), show willing to quit modal
        if (step === 0) {
          setShowWillingToQuitModal(true);
          return;
        }

        if (step >= 3) {
          router.push('/app');
          return;
        }

        const targetRoute = stepRoutes[step] || stepRoutes[0];
        router.push(targetRoute);
        return;
      }

      // If onboarding is complete, redirect to dashboard
      router.push('/app');
      onLogin(userType);
    } catch (err: any) {
      alert(err?.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWillingToQuitSelection = (pathway: '5As' | '5Rs') => {
    setShowWillingToQuitModal(false);

    // Store the pathway selection in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedPathway', pathway);
    }

    // Redirect to appropriate component
    if (pathway === '5As') {
      router.push('/5a/ask');
    } else {
      router.push('/5r/relevance');
    }
  };

  const startRedirectToLogin = (message: string) => {
    setToastMsg(message);
    setShowToast(true);
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setShowToast(false);
          setIsLogin(true);
          setStage('auth');
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      const userType: 'admin' | 'standard' = data?.user?.role === 'admin' ? 'admin' : 'standard';
      // Redirect admins to admin dashboard
      if (userType === 'admin') {
        router.push('/admin');
        return;
      }
      // Onboarding redirect guard
      const requires = !!data?.requiresOnboarding;
      const step = typeof data?.currentStep === 'number' ? data.currentStep : 0;

      // If onboarding is required, redirect to appropriate step
      // Note: Only first 4 steps are required (0-3), step 4 (arrange) is optional
      if (requires) {
        const stepRoutes: { [key: number]: string } = {
          0: '/5a/ask',
          1: '/5a/advise',
          2: '/5a/assess',
          3: '/5a/assist'
        };

        // If user hasn't started onboarding (step 0), show willing to quit modal
        if (step === 0) {
          setShowWillingToQuitModal(true);
          return;
        }

        // If user has completed first 4 steps (step >= 3), consider onboarding complete
        if (step >= 3) {
          router.push('/app');
          return;
        }

        const targetRoute = stepRoutes[step] || stepRoutes[0];
        router.push(targetRoute);
        return;
      }

      // If onboarding is complete, redirect to dashboard
      router.push('/app');
      onLogin(userType);
    } catch (err: any) {
      alert(err?.message || 'Login failed');
    }
  };

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    };

    setPasswordRequirements(requirements);

    // Calculate strength
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    if (metRequirements <= 2) {
      setPasswordStrength('weak');
    } else if (metRequirements <= 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }

    return Object.values(requirements).every(Boolean);
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/check-email/${encodeURIComponent(email)}`);
      const data = await res.json();
      return data.exists;
    } catch (err) {
      console.error('Error checking email:', err);
      return false; // On error, allow signup to proceed (fallback to backend validation)
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    // Validate password strength
    const isPasswordValid = validatePassword(formData.password);
    if (!isPasswordValid) {
      alert('Please ensure your password meets all requirements.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Check if email already exists
    setIsLoading(true);
    const emailExists = await checkEmailExists(formData.email);
    setIsLoading(false);

    if (emailExists) {
      setEmailError('This email is already registered. Please login instead.');
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signupEmail', formData.email);
      sessionStorage.setItem('signupPassword', formData.password);
      sessionStorage.setItem('signupFullName', formData.fullName);
    }
    setStage('onboarding');
  };

  const handleEmbeddedOnboardingComplete = async (data: OnboardingData, pathway: '5As' | '5Rs') => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const isGoogleSignup = typeof window !== 'undefined' && sessionStorage.getItem('googleSignup') === 'true';
    const signupEmail = (typeof window !== 'undefined' && sessionStorage.getItem('signupEmail')) || data.email;
    const signupPassword = typeof window !== 'undefined' ? sessionStorage.getItem('signupPassword') : null;
    const signupFullName = (typeof window !== 'undefined' && sessionStorage.getItem('signupFullName')) || data.name;

    if (!signupEmail) {
      alert('Missing signup credentials. Please start from the Sign Up page again.');
      return;
    }

    // For Google users, we don't need password as they're already authenticated
    if (!isGoogleSignup && !signupPassword) {
      alert('Missing signup credentials. Please start from the Sign Up page again.');
      return;
    }

    const profile = {
      full_name: signupFullName || data.name || '',
      phone: data.contactNumber || null,
      age: data.age ? parseInt(data.age as any, 10) : null,
      gender: data.gender || null,
      tobacco_type: data.tobaccoType || null,
      profile_metadata: {
        isStudent: data.isStudent,
        yearOfStudy: data.yearOfStudy,
        streamOfStudy: data.streamOfStudy,
        place: data.place,
        setting: data.setting,
        smokerType: data.smokerType,
        systemicHealthIssue: data.systemicHealthIssue,
        providedEmail: data.email,
        signup_method: isGoogleSignup ? 'google' : 'email',
        onboarding_pathway: pathway
      }
    };

    try {
      let res;

      if (isGoogleSignup) {
        // For Google users, update the existing user profile
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!accessToken) {
          alert('Session expired. Please sign in with Google again.');
          return;
        }

        res = await fetch(`${API_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(profile)
        });
      } else {
        // For regular email users, register as usual
        res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: signupEmail,
            password: signupPassword,
            role: 'user',
            profile
          })
        });
      }

      if (!res.ok) {
        const dataErr = await res.json().catch(() => ({}));
        if (res.status === 409) {
          startRedirectToLogin('Account already exists. Please log in to continue.');
          return;
        }
        throw new Error(dataErr?.error || 'Registration failed');
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('signupPassword');
          sessionStorage.removeItem('googleSignup');
        }

        if (isGoogleSignup) {
          // For Google users, require them to sign in again like regular users
          startRedirectToLogin('You have successfully signed up. Please log in to continue.');
        } else {
          startRedirectToLogin('You have successfully signed up. Please log in to continue.');
        }
        return;
      }
    } catch (err: any) {
      alert(err?.message || 'Registration failed');
      return;
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 lg:fixed lg:left-0 lg:top-0 lg:h-screen flex-col justify-center items-center p-12 bg-[#1C3B5E]"
      >
        <div className="text-center max-w-md">
          <h1 className="text-5xl mb-6 text-white">
            Quitting Journey
          </h1>
          <div className="mt-12 relative">
            <Image
              src="/images/cigarette-6161023_1280.webp"
              alt="Quit Smoking Journey"
              width={500}
              height={400}
              className="rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login/Sign Up Form */}
      <div className={`w-full lg:w-1/2 lg:ml-auto ${stage === 'onboarding' ? 'flex p-0' : 'flex items-center justify-center p-4 md:p-8'}`}>
        {stage === 'auth' && (
          <div className="w-full max-w-md">
            {/* Back to Landing */}
            <button
              onClick={onBackToLanding}
              className="mb-8 transition-colors hover:opacity-70 brand-text"
            >
              ← Back to Home
            </button>

            <div
              className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white shadow-[0_10px_40px_rgba(28,59,94,0.12)] auth-panel"
            >
              {stage === 'auth' && (
                <>
                  {/* Toggle Tabs */}
                  <div className="flex gap-2 mb-6 md:mb-8 p-1 rounded-2xl auth-tabs">
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setEmailError(''); // Clear error when switching modes
                      }}
                      className={`flex-1 py-3 rounded-xl transition-all auth-tab ${isLogin ? 'brand-btn text-white' : 'brand-text'}`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setEmailError(''); // Clear error when switching modes
                      }}
                      className={`flex-1 py-3 rounded-xl transition-all auth-tab ${!isLogin ? 'brand-btn text-white' : 'brand-text'}`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Form Title */}
                  <div className="mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl mb-2 brand-heading">
                      {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm md:text-base brand-muted">
                      {isLogin
                        ? 'Enter your credentials to continue your journey'
                        : 'Start your journey to a smoke-free life'}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4 md:space-y-5">
                    {/* Full Name (Sign Up Only) */}
                    {!isLogin && (
                      <div>
                        <Label htmlFor="fullName" className="brand-text">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="mt-2 h-12 rounded-xl border-2 brand-border placeholder:text-gray-400"
                          placeholder="Enter your full name"
                          required={!isLogin}
                        />
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="brand-text">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setEmailError(''); // Clear error when user types
                        }}
                        className={`mt-2 h-12 rounded-xl border-2 brand-border placeholder:text-gray-400 ${emailError ? 'border-red-500' : ''}`}
                        placeholder="your.email@example.com"
                        required
                      />
                      {emailError && (
                        <p className="text-xs mt-2 text-red-600">
                          {emailError}
                        </p>
                      )}
                      {isLogin && (
                        <p className="text-xs mt-2 text-[#666666]">
                          Tip: Use email with "admin" for admin access
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <Label htmlFor="password" className="brand-text">
                        Password
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            if (!isLogin) {
                              validatePassword(e.target.value);
                            }
                          }}
                          className="h-12 rounded-xl border-2 pr-12 brand-border placeholder:text-gray-400"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 brand-text opacity-50"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      {/* Password Strength Indicator (Sign Up Only) */}
                      {!isLogin && formData.password && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${passwordStrength === 'weak'
                                    ? 'w-1/3 bg-red-500'
                                    : passwordStrength === 'medium'
                                      ? 'w-2/3 bg-yellow-500'
                                      : 'w-full bg-green-500'
                                  }`}
                              />
                            </div>
                            <span
                              className={`text-xs font-medium ${passwordStrength === 'weak'
                                  ? 'text-red-600'
                                  : passwordStrength === 'medium'
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                                }`}
                            >
                              {passwordStrength === 'weak'
                                ? 'Weak'
                                : passwordStrength === 'medium'
                                  ? 'Medium'
                                  : 'Strong'}
                            </span>
                          </div>

                          {/* Requirements Checklist */}
                          <div className="space-y-1 text-xs">
                            <div className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                              <span>{passwordRequirements.minLength ? '✓' : '○'}</span>
                              <span>At least 8 characters</span>
                            </div>
                            <div className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                              <span>{passwordRequirements.hasUppercase ? '✓' : '○'}</span>
                              <span>One uppercase letter</span>
                            </div>
                            <div className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                              <span>{passwordRequirements.hasLowercase ? '✓' : '○'}</span>
                              <span>One lowercase letter</span>
                            </div>
                            <div className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                              <span>{passwordRequirements.hasNumber ? '✓' : '○'}</span>
                              <span>One number</span>
                            </div>
                            <div className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                              <span>{passwordRequirements.hasSpecialChar ? '✓' : '○'}</span>
                              <span>One special character (!@#$%^&*...)</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password (Sign Up Only) */}
                    {!isLogin && (
                      <div>
                        <Label htmlFor="confirmPassword" className="brand-text">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="mt-2 h-12 rounded-xl border-2 brand-border placeholder:text-gray-400"
                          placeholder="Re-enter your password"
                          required={!isLogin}
                        />
                      </div>
                    )}

                    {/* Forgot Password (Login Only) */}
                    {isLogin && (
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-sm transition-colors hover:opacity-70 brand-accent"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant={null as any}
                      className="w-full h-12 rounded-xl text-white brand-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Checking...' : (isLogin ? 'Login' : 'Continue')}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm brand-text opacity-50">
                      or
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Google Auth Button */}
                  <div id="google-signin-button" className="w-full flex justify-center">
                    {/* Google Sign-In button will be rendered here automatically */}
                  </div>

                  {/* Toggle Link */}
                  <p className="text-center brand-muted m-5">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="transition-colors hover:opacity-70 brand-accent"
                    >
                      {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {stage === 'onboarding' && (
          <div className="w-full min-h-screen">
            <InitialOnboarding embedded onComplete={handleEmbeddedOnboardingComplete} />
          </div>
        )}
      </div>
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="rounded-xl bg-[#1C3B5E] text-white px-4 py-3 shadow-lg max-w-sm">
            <div className="font-medium">{toastMsg}</div>
            <div className="text-sm opacity-80">Redirecting in {countdown}s</div>
          </div>
        </div>
      )}

      {/* Willing to Quit Modal */}
      <WillingToQuitModal
        isOpen={showWillingToQuitModal}
        onClose={() => setShowWillingToQuitModal(false)}
        onSelect={handleWillingToQuitSelection}
      />
    </div>
  );
}
