import React, { useState } from 'react';
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
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-[#1C3B5E]"
      >
        <div className="text-center max-w-md">
          <h1 className="text-5xl mb-6 text-white">
            Quitting Journey App
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Your path to a smoke-free life starts here. Join thousands who have successfully quit with our evidence-based support.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div>
              <p className="text-4xl mb-2 brand-accent">
                10K+
              </p>
              <p className="text-sm text-white/70">
                Users Helped
              </p>
            </div>
            <div>
              <p className="text-4xl mb-2 brand-accent">
                85%
              </p>
              <p className="text-sm text-white/70">
                Success Rate
              </p>
            </div>
            <div>
              <p className="text-4xl mb-2 brand-accent">
                24/7
              </p>
              <p className="text-sm text-white/70">
                Support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
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
                className="w-full h-12 rounded-xl text-white transition-all hover:opacity-90 shadow-md brand-btn"
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
