import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { AlertCircle, Lightbulb, Brain, Users, Coffee, Home, Check } from 'lucide-react';
import { getRoadblocksContent, Roadblock } from '../../../services/roadblocksService';
import { getPersonalRoadblockQuestions, getUserPersonalRoadblocks, saveUserPersonalRoadblock, PersonalRoadblockQuestion, UserPersonalRoadblock } from '../../../services/personalRoadblocksService';

interface FiveR_RoadblocksProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export function FiveR_Roadblocks({ onNext, onBack }: FiveR_RoadblocksProps) {
  const [commonRoadblocks, setCommonRoadblocks] = useState<Roadblock[]>([]);
  const [personalQuestions, setPersonalQuestions] = useState<PersonalRoadblockQuestion[]>([]);
  const [userResponses, setUserResponses] = useState<UserPersonalRoadblock[]>([]);
  const [selectedRoadblocks, setSelectedRoadblocks] = useState<string[]>([]);
  const [showResolutions, setShowResolutions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roadblocksData, questionsData] = await Promise.all([
          getRoadblocksContent(),
          getPersonalRoadblockQuestions()
        ]);
        
        setCommonRoadblocks(roadblocksData.roadblocks);
        setPersonalQuestions(questionsData.questions);

        // Try to load user responses if authenticated
        try {
          const userResponsesData = await getUserPersonalRoadblocks();
          setUserResponses(userResponsesData.responses);
        } catch (err) {
          // User not authenticated, continue without loading responses
          console.log('User not authenticated, skipping personal responses');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load roadblocks content');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleRoadblock = (id: number) => {
    setSelectedRoadblocks(prev => 
      prev.includes(id.toString()) 
        ? prev.filter(r => r !== id.toString())
        : [...prev, id.toString()]
    );
  };

  const handleNext = () => {
    onNext({ 
      selectedRoadblocks,
      personalResponses: userResponses
    });
  };

  const handleShowResolutions = () => {
    setShowResolutions(true);
  };

  const handlePersonalResponseChange = (questionId: number, response: string) => {
    // Update local state immediately for better UX
    const existingResponse = userResponses.find(r => r.question_id === questionId);
    
    if (existingResponse) {
      setUserResponses(prev => 
        prev.map(r => r.question_id === questionId ? { ...r, response } : r)
      );
    } else {
      setUserResponses(prev => [
        ...prev,
        {
          id: 0, // temporary
          question_id: questionId,
          response,
          question_text: personalQuestions.find(q => q.id === questionId)?.question_text || '',
          question_type: personalQuestions.find(q => q.id === questionId)?.question_type || 'challenge'
        }
      ]);
    }

    // Save to backend (async, don't wait for response)
    saveUserPersonalRoadblock(questionId, response).catch(err => {
      console.error('Failed to save personal roadblock response:', err);
    });
  };

  const handleBackToSelection = () => {
    setShowResolutions(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B2AA] mx-auto mb-4"></div>
          <p className="text-[#333333]">Loading roadblocks information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['RELEVANCE', 'RISKS', 'REWARDS', 'ROADBLOCKS', 'REPETITION']}
          currentStep={3}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          <h1 className="text-[#1C3B5E] mb-2">Step 4: ROADBLOCKS</h1>
          <p className="text-[#333333] mb-8">
            Identify potential obstacles to quitting and plan strategies to overcome them. 
            Being prepared helps you stay on track when challenges arise.
          </p>

          {/* Info Banner */}
          <div 
            className="mb-8 p-6 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(251, 146, 60, 0.1)',
              border: '2px solid rgba(251, 146, 60, 0.3)'
            }}
          >
            <div className="flex items-start gap-4">
              <Lightbulb className="flex-shrink-0 mt-1" style={{ color: '#FB923C' }} size={24} />
              <div>
                <h3 className="text-[#1C3B5E] mb-2">Preparation is Key</h3>
                <p className="text-[#333333] text-sm">
                  Everyone faces challenges when quitting. The difference between success and relapse 
                  is having a plan. Select the roadblocks you expect to face and review proven strategies 
                  to overcome them.
                </p>
              </div>
            </div>
          </div>

          {/* Common Roadblocks */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6 text-2xl font-semibold">Identify Your Roadblocks</h2>
            <p className="text-[#333333] mb-8 text-lg">
              Select the challenges you face when trying to quit smoking. 
              {!showResolutions && selectedRoadblocks.length > 0 && (
                <span className="block mt-2 text-[#20B2AA] font-medium">
                  {selectedRoadblocks.length} selected. Ready to see strategies?
                </span>
              )}
            </p>

            {!showResolutions ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {commonRoadblocks.map((roadblock) => {
                    const isSelected = selectedRoadblocks.includes(roadblock.id.toString());
                    return (
                      <div 
                        key={roadblock.id}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#20B2AA] bg-[#F0F9F9]' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => toggleRoadblock(roadblock.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-[#20B2AA]' : 'bg-gray-100 border-2 border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <h3 className="text-[#1C3B5E] font-medium">{roadblock.title}</h3>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedRoadblocks.length > 0 && (
                  <div className="flex justify-center mb-8">
                    <Button
                      onClick={handleShowResolutions}
                      className="px-8 py-6 text-lg rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
                    >
                      Show Me Strategies for {selectedRoadblocks.length} {selectedRoadblocks.length === 1 ? 'Challenge' : 'Challenges'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-6">
                  {commonRoadblocks
                    .filter(r => selectedRoadblocks.includes(r.id.toString()))
                    .map((roadblock) => (
                      <div 
                        key={roadblock.id}
                        className="p-6 rounded-2xl bg-white border-2 border-[#E0F2F1]"
                      >
                        <h3 className="text-[#1C3B5E] text-xl font-semibold mb-3">{roadblock.title}</h3>
                        <p className="text-[#333333] mb-4">{roadblock.description}</p>
                        <div className="p-4 bg-[#F0F9F9] rounded-lg border-l-4 border-[#20B2AA]">
                          <p className="text-[#1C3B5E] font-medium mb-2">Strategy:</p>
                          <p className="text-[#333333]">{roadblock.resolution}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            <p className="text-sm text-[#333333] opacity-70 mt-4 text-center">
              Click to select roadblocks and view strategies ({selectedRoadblocks.length} selected)
            </p>
          </div>

          {/* Personal Roadblock Section */}
          {personalQuestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[#1C3B5E] mb-6">Your Personal Roadblock (Optional)</h2>
              
              <div className="space-y-4">
                {personalQuestions.map((question) => {
                  const userResponse = userResponses.find(r => r.question_id === question.id);
                  
                  return (
                    <div key={question.id}>
                      <label className="block text-sm mb-2" style={{ color: '#333333' }}>
                        {question.question_text}
                      </label>
                      <Textarea
                        value={userResponse?.response || ''}
                        onChange={(e) => handlePersonalResponseChange(question.id, e.target.value)}
                        placeholder={question.placeholder}
                        className="rounded-xl border-2 min-h-24"
                        style={{ borderColor: '#E0E0E0' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              onClick={() => window.location.href = '/5a/ask'}
              className="flex-1 px-6 py-6 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
            >
              I'm Ready to Quit
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              className="flex-1 px-6 py-6 rounded-2xl border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA]/10"
            >
              Continue to Repetition
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
