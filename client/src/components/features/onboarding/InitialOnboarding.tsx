import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface InitialOnboardingProps {
  onComplete: (data: OnboardingData, pathway: '5As' | '5Rs') => void;
  embedded?: boolean;
}

export interface OnboardingData {
  name: string;
  age: string;
  gender: string;
  isStudent: string;
  yearOfStudy: string;
  streamOfStudy: string;
  email: string;
  contactNumber: string;
  place: string;
  setting: string;
  tobaccoType: string;
  smokerType: string;
  systemicHealthIssue: string;
}

export const InitialOnboarding: React.FC<InitialOnboardingProps> = ({ onComplete, embedded }) => {
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    age: '',
    gender: '',
    isStudent: '',
    yearOfStudy: '',
    streamOfStudy: '',
    email: '',
    contactNumber: '',
    place: '',
    setting: '',
    tobaccoType: '',
    smokerType: '',
    systemicHealthIssue: '',
  });

  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefillName = sessionStorage.getItem('signupFullName') || '';
      const prefillEmail = sessionStorage.getItem('signupEmail') || '';
      setFormData(prev => ({
        ...prev,
        name: prev.name || prefillName,
        email: prev.email || prefillEmail,
      }));
    }
  }, []);

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePathwaySelection = (pathway: '5As' | '5Rs') => {
    // Validate required fields based on conditions
    const requiredFields = ['name', 'age', 'gender', 'isStudent', 'email', 'contactNumber', 'place', 'setting', 'tobaccoType', 'systemicHealthIssue'];

    // Add student fields if user is a student
    if (formData.isStudent === 'yes') {
      requiredFields.push('yearOfStudy', 'streamOfStudy');
    }

    // Add smokerType if tobacco type is smoked or both
    if (formData.tobaccoType === 'smoked' || formData.tobaccoType === 'both') {
      requiredFields.push('smokerType');
    }

    const missingFields = requiredFields.filter(field => !formData[field as keyof OnboardingData]?.trim());

    if (missingFields.length > 0) {
      alert('Please fill in all required fields before proceeding.');
      return;
    }

    onComplete(formData, pathway);
  };

  // Check if pathway buttons should be enabled
  const isPathwayEnabled = () => {
    // Basic required fields
    const basicFields = ['name', 'age', 'gender', 'isStudent', 'email', 'contactNumber', 'place', 'setting', 'tobaccoType', 'systemicHealthIssue'];
    const basicFieldsFilled = basicFields.every(field => formData[field as keyof OnboardingData]?.trim());

    if (!basicFieldsFilled) return false;

    // Check student fields if applicable
    if (formData.isStudent === 'yes') {
      if (!formData.yearOfStudy?.trim() || !formData.streamOfStudy?.trim()) return false;
    }

    // Check smoker type if applicable
    if (formData.tobaccoType === 'smoked' || formData.tobaccoType === 'both') {
      if (!formData.smokerType?.trim()) return false;
    }

    return true;
  };

  // Basic info (Step 1) completeness checker
  const isBasicInfoComplete = () => {
    const basic = ['name', 'age', 'gender', 'isStudent', 'email', 'contactNumber', 'place', 'setting'];
    if (!basic.every(field => formData[field as keyof OnboardingData]?.trim())) return false;
    if (formData.isStudent === 'yes') {
      if (!formData.yearOfStudy?.trim() || !formData.streamOfStudy?.trim()) return false;
    }
    return true;
  };

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} flex items-center justify-center p-4 md:p-6 lg:p-8`} style={{ backgroundColor: '#FFFFFF' }}>
      <div
        className="w-full max-w-4xl p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 40px rgba(28, 59, 94, 0.12)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 lg:mb-10">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl mb-2"
            style={{ color: '#1C3B5E' }}
          >
            Your Quitting Journey Begins
          </h1>
          <p className="text-sm md:text-base" style={{ color: '#333333', opacity: 0.7 }}>
            Help us understand your needs to personalize your journey
          </p>
        </div>

        {step === 1 && (
          <div className="mb-6 md:mb-8">
            <h2
              className="text-xl md:text-2xl mb-4 md:mb-6"
              style={{ color: '#1C3B5E' }}
            >
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <Label htmlFor="name" style={{ color: '#333333' }}>Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-2 rounded-xl border-2 placeholder:text-gray-400"
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
                  className="mt-2 rounded-xl border-2 placeholder:text-gray-400"
                  style={{ borderColor: '#E0E0E0' }}
                  placeholder="Enter your age"
                />
              </div>
            </div>

            <div className="mb-4 md:mb-6">
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

            <div className="mb-4 md:mb-6">
              <Label style={{ color: '#333333' }}>Are you a student?</Label>
              <div className="flex gap-3 mt-2">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange('isStudent', option.toLowerCase());
                      // Clear student fields if "No" is selected
                      if (option === 'No') {
                        handleInputChange('yearOfStudy', '');
                        handleInputChange('streamOfStudy', '');
                      }
                    }}
                    className="flex-1 py-3 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: formData.isStudent === option.toLowerCase() ? '#20B2AA' : '#FFFFFF',
                      color: formData.isStudent === option.toLowerCase() ? '#FFFFFF' : '#333333',
                      border: `2px solid ${formData.isStudent === option.toLowerCase() ? '#20B2AA' : '#E0E0E0'}`
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {formData.isStudent === 'yes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <Label htmlFor="yearOfStudy" style={{ color: '#333333' }}>Year of Study</Label>
                  <Select value={formData.yearOfStudy} onValueChange={(value) => handleInputChange('yearOfStudy', value)}>
                    <SelectTrigger className="mt-2 rounded-xl border-2" style={{ borderColor: '#E0E0E0' }}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="1st year">1st Year</SelectItem>
                      <SelectItem value="2nd year">2nd Year</SelectItem>
                      <SelectItem value="3rd year">3rd Year</SelectItem>
                      <SelectItem value="4th year">4th Year</SelectItem>
                      <SelectItem value="5th year">5th Year</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="streamOfStudy" style={{ color: '#333333' }}>Stream of Study</Label>
                  <Select value={formData.streamOfStudy} onValueChange={(value) => handleInputChange('streamOfStudy', value)}>
                    <SelectTrigger className="mt-2 rounded-xl border-2" style={{ borderColor: '#E0E0E0' }}>
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="dental">Dental</SelectItem>
                      <SelectItem value="business">Business/Management</SelectItem>
                      <SelectItem value="arts">Arts & Humanities</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="law">Law</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="nursing">Nursing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="computer_science">Computer Science/IT</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <Label htmlFor="email" style={{ color: '#333333' }}>Email ID</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-2 rounded-xl border-2 placeholder:text-gray-400"
                  style={{ borderColor: '#E0E0E0' }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="contact" style={{ color: '#333333' }}>Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className="mt-2 rounded-xl border-2 placeholder:text-gray-400"
                  style={{ borderColor: '#E0E0E0' }}
                  placeholder="8989898989"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <Label htmlFor="place" style={{ color: '#333333' }}>Place</Label>
                <Input
                  id="place"
                  type="text"
                  value={formData.place}
                  onChange={(e) => handleInputChange('place', e.target.value)}
                  className="mt-2 rounded-xl border-2 placeholder:text-gray-400"
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

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!isBasicInfoComplete()} className="h-12 rounded-xl text-white" style={{ backgroundColor: '#20B2AA' }}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mb-8">
            <h2
              className="mb-6"
              style={{ color: '#1C3B5E' }}
            >
              Tobacco Use Status
            </h2>

            <div className="mb-6">
              <Label style={{ color: '#333333' }}>Which best describes you?</Label>
              <div className="flex flex-col md:flex-row gap-3 mt-2">
                {[
                  { label: 'I use smoked tobacco', value: 'smoked' },
                  { label: 'I use smokeless tobacco', value: 'smokeless' },
                  { label: 'I use both', value: 'both' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleInputChange('tobaccoType', option.value);
                      // Clear smoker type if switching to smokeless
                      if (option.value === 'smokeless') {
                        handleInputChange('smokerType', '');
                      }
                    }}
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

            {(formData.tobaccoType === 'smoked' || formData.tobaccoType === 'both') && (
              <div className="mb-6">
                <Label style={{ color: '#333333', marginBottom: '12px', display: 'block' }}>Type of Smoker</Label>
                <RadioGroup
                  value={formData.smokerType}
                  onValueChange={(value) => {
                    handleInputChange('smokerType', value as string);
                  }}
                  className="space-y-3"
                >
                  {[
                    { label: 'Ever smoker (ever smoked till date)', value: 'ever' },
                    { label: 'Current smoker (currently smoking)', value: 'current' },
                    { label: 'Daily smoker (everyday smoker)', value: 'daily' },
                    { label: 'Former smoker (currently do not smoke)', value: 'former' },
                    { label: 'Never smoker (never smoked)', value: 'never' }
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
            )}

            <div className="mb-6">
              <Label style={{ color: '#333333' }}>Systemic health issue?</Label>
              <div className="flex gap-3 mt-2">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('systemicHealthIssue', option.toLowerCase())}
                    className="flex-1 py-3 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: formData.systemicHealthIssue === option.toLowerCase() ? '#20B2AA' : '#FFFFFF',
                      color: formData.systemicHealthIssue === option.toLowerCase() ? '#FFFFFF' : '#333333',
                      border: `2px solid ${formData.systemicHealthIssue === option.toLowerCase() ? '#20B2AA' : '#E0E0E0'}`
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
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
              Complete Your Profile
            </h2>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <button
                onClick={() => handlePathwaySelection('5As')}
                disabled={!isPathwayEnabled()}
                className="flex-1 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isPathwayEnabled() ? '#20B2AA' : '#CCCCCC',
                  color: '#FFFFFF',
                }}
              >
                <div>
                  <div className="mb-1 font-semibold">Continue</div>
                  <div style={{ opacity: 0.9, fontSize: '0.875rem' }}>Submit and proceed to login</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
