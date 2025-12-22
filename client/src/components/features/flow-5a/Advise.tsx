import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { BackToHomeButton } from '../../shared/BackToHomeButton';
import { Play } from 'lucide-react';
import { FiveA_AdviseProps } from '../../../types/fiveAFlow';
import { userService } from '../../../services/userService';

interface ExtendedFiveAAdviseProps extends FiveA_AdviseProps {
  video?: string;
  quote?: string;
  ai_message?: string;
  loading?: boolean;
}

export function FiveA_Advise({ onNext, userData = {}, video, quote, ai_message, loading = false }: ExtendedFiveAAdviseProps) {
  const [userOnboardingStep, setUserOnboardingStep] = useState<number | null>(null);

  // Fetch user profile to get onboarding_step
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUserOnboardingStep(response.data.onboarding_step || 0);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserOnboardingStep(0);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={1}
        />

        {userOnboardingStep !== null && userOnboardingStep >= 3 && (
          <div className="absolute top-10 left-10">
            <BackToHomeButton />
          </div>
        )}

        <div
          className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 40px rgba(28, 59, 94, 0.12)'
          }}
        >
          <h1
            className="text-2xl md:text-3xl lg:text-4xl mb-2"
            style={{ color: '#1C3B5E' }}
          >
            Step 2: Personalized Advice to Quit
          </h1>
          <p
            className="text-sm md:text-base mb-6 md:mb-8 lg:mb-10"
            style={{ color: '#333333', opacity: 0.7 }}
          >
            Receive expert guidance and personalized insights for your journey
          </p>

          {/* Video Placeholder */}
          <div
            className="rounded-2xl overflow-hidden mb-8 aspect-video flex items-center justify-center"
            style={{
              backgroundColor: '#1C3B5E',
              boxShadow: '0 4px 12px rgba(28, 59, 94, 0.15)'
            }}
          >
            {video ? (
              <div className="w-full h-full">
                {video.includes('youtube.com') || video.includes('youtu.be') ? (
                  <iframe
                    src={video.includes('youtube.com') ? video.replace('watch?v=', 'embed/') : video.replace('youtu.be/', 'www.youtube.com/embed/')}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Advise Video"
                  />
                ) : (
                  <video controls className="w-full h-full">
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="text-center" style={{ color: '#FFFFFF' }}>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: '#20B2AA' }}
                >
                  <Play size={32} fill="white" />
                </div>
                <p className="mb-2">Short Video Message from Doctor/Dentist</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.75 }}>
                  Expert advice tailored to your needs
                </p>
              </div>
            )}
          </div>

          {/* Motivational Message */}
          <div
            className="rounded-2xl p-8 mb-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #1C3B5E 0%, #2a5a7e 100%)',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(28, 59, 94, 0.2)'
            }}
          >
            <div
              className="inline-block px-4 py-1 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(32, 178, 170, 0.2)' }}
            >
              <span style={{ fontSize: '0.875rem' }}>Why Quitting Matters</span>
            </div>
            <p
              className="mb-3"
              style={{ fontSize: '1.25rem', lineHeight: '1.6' }}
            >
              "{quote || 'Quitting now improves lung capacity within weeks!'}"
            </p>
            <p style={{ opacity: 0.9 }}>
              Your body begins healing immediately after your last cigarette.
            </p>
          </div>

          {/* AI Personalized Message */}
          <div
            className="rounded-2xl p-7"
            style={{
              backgroundColor: 'rgba(32, 178, 170, 0.08)',
              borderLeft: '4px solid #20B2AA',
              boxShadow: '0 2px 8px rgba(32, 178, 170, 0.1)'
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: '#20B2AA',
                  color: '#FFFFFF'
                }}
              >
                <span style={{ fontSize: '0.875rem' }}>AI</span>
              </div>
              <div className="flex-1">
                <p
                  className="mb-1"
                  style={{
                    color: '#20B2AA'
                  }}
                >
                  Personalized Insight
                </p>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                ) : (
                  <div style={{ color: '#333333', lineHeight: '1.6' }}>
                    <p className="mb-3">{ai_message || 'As a years-old user, quitting now may add 10 healthy years to your life. Studies show that people who quit before age 40 reduce their risk of dying from smoking-related disease by about 90%.'}</p>
                    <p style={{ color: '#333333', opacity: 0.85, lineHeight: '1.6' }}>
                      Your investment in health today will compound over the years, giving you more time
                      with loved ones and greater quality of life.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <HesitationLink />

          <div className="mt-4 flex justify-end">
            <Button
              onClick={onNext}
              className="px-8 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: '#20B2AA',
                color: '#FFFFFF'
              }}
            >
              Next: Assess Your Readiness
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
