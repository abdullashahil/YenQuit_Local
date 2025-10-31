import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Eye, EyeOff } from 'lucide-react';

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock authentication - check if email contains "admin"
    if (formData.email.toLowerCase().includes('admin')) {
      onLogin('admin');
    } else {
      onLogin('standard');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Proceed to onboarding for new users
    onSignUp();
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
      <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Back to Landing */}
          <button
            onClick={onBackToLanding}
            className="mb-8 transition-colors hover:opacity-70 brand-text"
          >
            ← Back to Home
          </button>

          {/* Form Container */}
          <div 
            className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white shadow-[0_10px_40px_rgba(28,59,94,0.12)] auth-panel"
          >
            {/* Toggle Tabs */}
            <div className="flex gap-2 mb-6 md:mb-8 p-1 rounded-2xl auth-tabs">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl transition-all auth-tab ${isLogin ? 'brand-btn text-white' : 'brand-text'}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
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
                    className="mt-2 h-12 rounded-xl border-2 brand-border"
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 h-12 rounded-xl border-2 brand-border"
                  placeholder="your.email@example.com"
                  required
                />
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
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 rounded-xl border-2 pr-12 brand-border"
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
                    className="mt-2 h-12 rounded-xl border-2 brand-border"
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
              >
                {isLogin ? 'Login' : 'Get Started'}
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
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-2 brand-border hover:bg-gray-50 transition-all"
              onClick={() => {
                // TODO: Implement Google OAuth
                alert('Google authentication will be implemented');
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Toggle Link */}
            <p className="text-center brand-muted">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="transition-colors hover:opacity-70 brand-accent"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
