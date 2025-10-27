import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';

interface InitialOnboardingProps {
  onComplete: (data: OnboardingData, pathway: '5As' | '5Rs') => void;
}

export interface OnboardingData {
  name: string;
  age: string;
  gender: string;
  email: string;
  contactNumber: string;
  place: string;
  setting: string;
  tobaccoType: string;
  smokerType: string;
}

export const InitialOnboarding: React.FC<InitialOnboardingProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    age: '',
    gender: '',
    email: '',
    contactNumber: '',
    place: '',
    setting: '',
    tobaccoType: '',
    smokerType: '',
  });

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePathwaySelection = (pathway: '5As' | '5Rs') => {
    // Validate all fields are filled
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
    
    if (!allFieldsFilled) {
      alert('Please fill in all fields before proceeding.');
      return;
    }
    
    onComplete(formData, pathway);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div 
        className="w-full max-w-4xl p-10 rounded-3xl"
        style={{ 
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 40px rgba(28, 59, 94, 0.12)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 
            className="mb-2"
            style={{ color: '#1C3B5E' }}
          >
            Your Quitting Journey Begins
          </h1>
          <p style={{ color: '#333333', opacity: 0.7 }}>
            Help us understand your needs to personalize your journey
          </p>
        </div>

        {/* Demographics Collection */}
        <div className="mb-8">
          <h2 
            className="mb-6"
            style={{ color: '#1C3B5E' }}
          >
            Personal Information
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="name" style={{ color: '#333333' }}>Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-2 rounded-xl border-2"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="age" style={{ color: '#333333' }}>Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="mt-2 rounded-xl border-2"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="Enter your age"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label style={{ color: '#333333' }}>Gender</Label>
              <div className="flex gap-3 mt-2">
                {['Male', 'Female', 'Other'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('gender', option)}
                    className="flex-1 py-3 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: formData.gender === option ? '#20B2AA' : '#FFFFFF',
                      color: formData.gender === option ? '#FFFFFF' : '#333333',
                      border: `2px solid ${formData.gender === option ? '#20B2AA' : '#E0E0E0'}`
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="email" style={{ color: '#333333' }}>Email ID</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-2 rounded-xl border-2"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="contact" style={{ color: '#333333' }}>Contact Number</Label>
              <Input
                id="contact"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                className="mt-2 rounded-xl border-2"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <Label htmlFor="place" style={{ color: '#333333' }}>Place</Label>
              <Input
                id="place"
                type="text"
                value={formData.place}
                onChange={(e) => handleInputChange('place', e.target.value)}
                className="mt-2 rounded-xl border-2"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="City, State/Country"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label style={{ color: '#333333' }}>Setting</Label>
            <div className="flex gap-3 mt-2">
              {['Urban', 'Rural'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleInputChange('setting', option)}
                  className="flex-1 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: formData.setting === option ? '#20B2AA' : '#FFFFFF',
                    color: formData.setting === option ? '#FFFFFF' : '#333333',
                    border: `2px solid ${formData.setting === option ? '#20B2AA' : '#E0E0E0'}`
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Identification */}
        <div className="mb-8">
          <h2 
            className="mb-6"
            style={{ color: '#1C3B5E' }}
          >
            Tobacco Use Status
          </h2>

          <div className="mb-6">
            <Label style={{ color: '#333333' }}>Which best describes you?</Label>
            <div className="flex gap-3 mt-2">
              {[
                { label: 'I use smoked tobacco', value: 'smoked' },
                { label: 'I use smokeless tobacco', value: 'smokeless' },
                { label: 'I use both', value: 'both' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('tobaccoType', option.value)}
                  className="flex-1 py-3 px-4 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: formData.tobaccoType === option.value ? '#20B2AA' : '#FFFFFF',
                    color: formData.tobaccoType === option.value ? '#FFFFFF' : '#333333',
                    border: `2px solid ${formData.tobaccoType === option.value ? '#20B2AA' : '#E0E0E0'}`
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label style={{ color: '#333333', marginBottom: '12px', display: 'block' }}>Type of Smoker</Label>
            <RadioGroup 
              value={formData.smokerType} 
              onValueChange={(value) => handleInputChange('smokerType', value as string)}
              className="space-y-3"
            >
              {[
                { label: 'Ever smoker', value: 'ever' },
                { label: 'Current smoker', value: 'current' },
                { label: 'Daily smoker', value: 'daily' },
                { label: 'Former smoker', value: 'former' },
                { label: 'Never smoker', value: 'never' }
              ].map((option) => (
                <div 
                  key={option.value}
                  className="flex items-center p-4 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: formData.smokerType === option.value ? 'rgba(32, 178, 170, 0.08)' : '#FFFFFF',
                    border: `2px solid ${formData.smokerType === option.value ? '#20B2AA' : '#E0E0E0'}`
                  }}
                >
                  <RadioGroupItem 
                    value={option.value} 
                    id={option.value}
                    style={{ 
                      borderColor: '#20B2AA',
                      color: '#20B2AA'
                    }}
                  />
                  <Label 
                    htmlFor={option.value} 
                    className="ml-3 cursor-pointer flex-1"
                    style={{ color: '#333333' }}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* The Decision Point */}
        <div 
          className="pt-8 mt-8"
          style={{ 
            borderTop: '2px solid #E0E0E0'
          }}
        >
          <h2 
            className="text-center mb-8"
            style={{ color: '#1C3B5E' }}
          >
            Are you willing to Quit this habit?
          </h2>

          <div className="flex gap-6">
            <button
              onClick={() => handlePathwaySelection('5As')}
              className="flex-1 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: '#20B2AA',
                color: '#FFFFFF',
              }}
            >
              <div>
                <div className="mb-1">Yes, I'm Ready</div>
                <div style={{ opacity: 0.9, fontSize: '0.875rem' }}>Start 5 A's Framework</div>
              </div>
            </button>

            <button
              onClick={() => handlePathwaySelection('5Rs')}
              className="flex-1 py-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#20B2AA',
                border: '2px solid #20B2AA'
              }}
            >
              <div>
                <div className="mb-1">No, I Need Motivation</div>
                <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>Start 5 R's Framework</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
