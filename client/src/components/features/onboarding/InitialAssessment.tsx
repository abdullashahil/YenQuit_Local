import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';

interface InitialAssessmentProps {
  onComplete: (data: any, path: '5A' | '5R') => void;
}

export function InitialAssessment({ onComplete }: InitialAssessmentProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    contact: '',
    place: '',
    setting: '',
    tobaccoType: '',
    smokerType: '',
    willingToQuit: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.name && formData.age && formData.gender && 
           formData.email && formData.contact && formData.place && 
           formData.setting && formData.tobaccoType && formData.smokerType;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        <h1 className="text-[#1C3B5E] text-center mb-8">
          Welcome to Your Quitting Journey
        </h1>

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          {/* Demographics Section */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-[#333333]">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-2 rounded-xl border-gray-300"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-[#333333]">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="mt-2 rounded-xl border-gray-300"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-[#333333]">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="mt-2 rounded-xl border-gray-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="contact" className="text-[#333333]">Contact Number *</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  className="mt-2 rounded-xl border-gray-300"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="place" className="text-[#333333]">Place *</Label>
                <Input
                  id="place"
                  value={formData.place}
                  onChange={(e) => handleChange('place', e.target.value)}
                  className="mt-2 rounded-xl border-gray-300"
                  placeholder="City, State"
                />
              </div>

              <div>
                <Label className="text-[#333333] block mb-3">Gender *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value as string)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="col-span-2">
                <Label className="text-[#333333] block mb-3">Setting *</Label>
                <RadioGroup
                  value={formData.setting}
                  onValueChange={(value) => handleChange('setting', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urban" id="urban" />
                    <Label htmlFor="urban" className="cursor-pointer">Urban</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rural" id="rural" />
                    <Label htmlFor="rural" className="cursor-pointer">Rural</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Status Identification */}
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h2 className="text-[#1C3B5E] mb-6">Tobacco Use Status</h2>
            
            <div className="mb-6">
              <Label className="text-[#333333] block mb-3">
                Which of the following best describes you? *
              </Label>
              <div className="flex gap-3">
                {['I use smoked tobacco', 'I use smokeless tobacco', 'I use both'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleChange('tobaccoType', option)}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                      formData.tobaccoType === option
                        ? 'border-[#20B2AA] bg-[#20B2AA]/10 text-[#20B2AA]'
                        : 'border-gray-300 hover:border-[#20B2AA]/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-[#333333] block mb-3">Type of Smoker *</Label>
              <RadioGroup
                value={formData.smokerType}
                onValueChange={(value) => handleChange('smokerType', value as string)}
                className="space-y-3"
              >
                {['Ever smoker', 'Current smoker', 'Daily smoker', 'Former smoker', 'Never smoker'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* The Decision Point */}
          {isFormValid() && (
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-[#1C3B5E] mb-6 text-center">
                Are you willing to Quit this habit?
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => onComplete(formData, '5A')}
                  className="h-20 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
                >
                  <div className="text-center">
                    <div>Yes, I'm Ready</div>
                    <div className="text-sm opacity-90">(Start 5 A's)</div>
                  </div>
                </Button>

                <Button
                  onClick={() => onComplete(formData, '5R')}
                  variant="outline"
                  className="h-20 rounded-2xl border-2 border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA]/10"
                >
                  <div className="text-center">
                    <div>No, I Need Motivation</div>
                    <div className="text-sm opacity-90">(Start 5 R's)</div>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
