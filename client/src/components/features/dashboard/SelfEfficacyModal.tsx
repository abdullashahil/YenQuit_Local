import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { X, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import quitTrackerService from "../../../services/quitTrackerService";

interface Question {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'scale' | 'text';
  options?: string[];
  is_required: boolean;
  display_order: number;
}

interface SelfEfficacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  isPostSelfEfficacy?: boolean;
}

export function SelfEfficacyModal({ open, onOpenChange, onComplete, isPostSelfEfficacy = false }: SelfEfficacyModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load questions when modal opens
  useEffect(() => {
    if (open) {
      loadQuestions();
    }
  }, [open]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await quitTrackerService.getQuestionnaire();
      setQuestions(response.data);
      setCurrentQuestionIndex(0);
      setResponses({});
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load questionnaire');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseChange = (questionId: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const validateCurrentQuestion = () => {
    if (!questions.length || currentQuestionIndex >= questions.length) {
      return null;
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      return null;
    }
    
    if (currentQuestion.is_required && !responses[currentQuestion.id]) {
      return 'This question is required';
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate all required questions
      for (const question of questions) {
        if (question.is_required && !responses[question.id]) {
          setError(`Question "${question.question_text}" is required`);
          return;
        }
      }

      // Convert responses to required format
      const formattedResponses = Object.entries(responses).map(([questionId, value]) => ({
        questionId: parseInt(questionId),
        value
      }));

      // Use appropriate service method based on modal type
      if (isPostSelfEfficacy) {
        await quitTrackerService.savePostSelfEfficacyResponses(formattedResponses);
      } else {
        await quitTrackerService.saveQuestionnaireResponses(formattedResponses);
      }
      
      onComplete();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save responses');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = questions.length > 0 && currentQuestionIndex === questions.length - 1;
  const canGoNext = validateCurrentQuestion() === null && currentQuestion;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold" style={{ color: "#1C3B5E" }}>
            {isPostSelfEfficacy ? 'Post Self-Efficacy Questions' : 'Quit Tracking Questionnaire'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "#333333" }}>
              Question {questions.length > 0 ? currentQuestionIndex + 1 : 0} of {questions.length}
            </span>
            <span className="text-sm" style={{ color: "#20B2AA" }}>
              {questions.length > 0 ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%`,
                backgroundColor: "#20B2AA"
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 280px)" }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B2AA]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadQuestions} variant="outline">
                Try Again
              </Button>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1C3B5E" }}>
                  {currentQuestion.question_text}
                  {currentQuestion.is_required && <span className="text-red-500 ml-1">*</span>}
                </h3>

                {/* Multiple Choice */}
                {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center p-4 border rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
                        style={{
                          borderColor: responses[currentQuestion.id] === option ? "#20B2AA" : "#e5e7eb",
                          backgroundColor: responses[currentQuestion.id] === option ? "#20B2AA10" : "transparent"
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={option}
                          checked={responses[currentQuestion.id] === option}
                          onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                            responses[currentQuestion.id] === option
                              ? "border-[#20B2AA] bg-[#20B2AA]"
                              : "border-gray-300"
                          }`}
                        >
                          {responses[currentQuestion.id] === option && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-sm" style={{ color: "#333333" }}>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Scale */}
                {currentQuestion.question_type === 'scale' && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs" style={{ color: "#666666" }}>
                      <span>Not confident</span>
                      <span>Very confident</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleResponseChange(currentQuestion.id, num.toString())}
                          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                            responses[currentQuestion.id] === num.toString()
                              ? "bg-[#20B2AA] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text */}
                {currentQuestion.question_type === 'text' && (
                  <textarea
                    value={responses[currentQuestion.id] || ''}
                    onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                    placeholder="Enter your response..."
                    className="w-full p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
                    rows={4}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!canGoNext || isSubmitting}
                className="rounded-xl px-8"
                style={{ backgroundColor: "#20B2AA", color: "white" }}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isPostSelfEfficacy ? 'Complete Assessment' : 'Complete Setup'}
                  </div>
                )}
              </Button>
            ) : (
              <Button
                onClick={goToNextQuestion}
                disabled={!canGoNext}
                className="rounded-xl px-8"
                style={{ backgroundColor: "#20B2AA", color: "white" }}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
