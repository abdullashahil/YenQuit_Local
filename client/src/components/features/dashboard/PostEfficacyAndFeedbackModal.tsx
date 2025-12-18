import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { X, ChevronLeft, ChevronRight, CheckCircle, MessageSquare, Target } from "lucide-react";
import quitTrackerService from "../../../services/quitTrackerService";

interface Question {
    id: number;
    question_text: string;
    question_type?: 'multiple_choice' | 'scale' | 'text';
    options?: string[]; // Note: feedback options coming from DB might be string or array, need parsing if string
    is_required?: boolean;
}

interface PostEfficacyAndFeedbackModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: () => void;
    userName?: string;
    hasCompletedPostSelfEfficacy?: boolean;
}

export function PostEfficacyAndFeedbackModal({
    open,
    onOpenChange,
    onComplete,
    hasCompletedPostSelfEfficacy = false
}: PostEfficacyAndFeedbackModalProps) {
    const [step, setStep] = useState<'intro' | 'efficacy' | 'feedback' | 'outro'>('intro');
    const [efficacyQuestions, setEfficacyQuestions] = useState<Question[]>([]);
    const [feedbackQuestions, setFeedbackQuestions] = useState<Question[]>([]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [efficacyResponses, setEfficacyResponses] = useState<Record<number, string>>({});
    const [feedbackResponses, setFeedbackResponses] = useState<Record<number, string>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load questions when modal opens
    useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Load efficacy questions if not completed
            if (!hasCompletedPostSelfEfficacy) {
                const efficacyData = await quitTrackerService.getQuestionnaire();
                setEfficacyQuestions(efficacyData.data || []);
            }

            // Load feedback questions
            const feedbackData = await quitTrackerService.getFeedbackQuestions();
            // Ensure options are parsed if they come as strings
            const parsedFeedbackQuestions = (feedbackData.data || []).map((q: any) => ({
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                question_type: 'multiple_choice' // Force type for feedback as they are all multiple choice
            }));
            setFeedbackQuestions(parsedFeedbackQuestions);

            // Determine start step
            if (hasCompletedPostSelfEfficacy) {
                setStep('feedback');
            } else {
                setStep('intro');
            }

            setCurrentQuestionIndex(0);
        } catch (err: any) {
            console.error(err);
            setError('Failed to load questions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResponseChange = (questionId: number, value: string, isFeedback: boolean) => {
        if (isFeedback) {
            setFeedbackResponses(prev => ({ ...prev, [questionId]: value }));
        } else {
            setEfficacyResponses(prev => ({ ...prev, [questionId]: value }));
        }
    };

    const handleOptionSelect = (questionId: number, value: string, isFeedback: boolean) => {
        handleResponseChange(questionId, value, isFeedback);
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 300);
        }
    };

    const currentQuestions = step === 'efficacy' ? efficacyQuestions : feedbackQuestions;
    const currentResponses = step === 'efficacy' ? efficacyResponses : feedbackResponses;

    const goToNextQuestion = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const submitEfficacy = async () => {
        try {
            setIsSubmitting(true);

            const formattedResponses = Object.entries(efficacyResponses).map(([questionId, value]) => ({
                questionId: parseInt(questionId),
                value
            }));

            await quitTrackerService.savePostSelfEfficacyResponses(formattedResponses);

            // Move to feedback
            setStep('feedback');
            setCurrentQuestionIndex(0);
            setIsSubmitting(false);
        } catch (err: any) {
            setError(err.message || 'Failed to save responses');
            setIsSubmitting(false);
        }
    };

    const submitFeedback = async () => {
        try {
            setIsSubmitting(true);

            const formattedResponses = Object.entries(feedbackResponses).map(([questionId, value]) => ({
                questionId: parseInt(questionId),
                value
            }));

            await quitTrackerService.saveUserFeedback(formattedResponses);

            setStep('outro');
            setIsSubmitting(false);
        } catch (err: any) {
            setError(err.message || 'Failed to save feedback');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        if (step === 'outro') {
            onComplete();
        }
    };

    if (!open) return null;

    // Intro Step
    if (step === 'intro') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <Card className="w-full max-w-md p-6 rounded-3xl shadow-2xl !bg-white text-center">
                    <div className="mx-auto w-16 h-16 bg-[#20B2AA20] rounded-full flex items-center justify-center mb-6">
                        <Target className="w-8 h-8 text-[#20B2AA]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: "#1C3B5E" }}>Check-in</h2>
                    <p className="text-gray-600 mb-8">
                        Congratulations heavily on your progress! Let's check your status and get your feedback on the app.
                    </p>
                    <Button
                        className="w-full py-6 rounded-2xl text-white text-lg"
                        style={{ backgroundColor: "#20B2AA" }}
                        onClick={() => setStep('efficacy')}
                    >
                        Start Check-in
                    </Button>
                </Card>
            </div>
        );
    }

    // Outro Step
    if (step === 'outro') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <Card className="w-full max-w-md p-6 rounded-3xl shadow-2xl !bg-white text-center">
                    <div className="mx-auto w-16 h-16 bg-[#20B2AA20] rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-8 h-8 text-[#20B2AA]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: "#1C3B5E" }}>Thank You!</h2>
                    <p className="text-gray-600 mb-8">
                        Your feedback helps us improve YenQuit for everyone. Stay strong on your journey!
                    </p>
                    <Button
                        className="w-full py-6 rounded-2xl text-white text-lg"
                        style={{ backgroundColor: "#20B2AA" }}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Card>
            </div>
        );
    }

    // Question Step (Efficacy or Feedback)
    const isEfficacy = step === 'efficacy';
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
    const canGoNext = currentQuestion && !!currentResponses[currentQuestion.id];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl !bg-white flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#1C3B5E" }}>
                        {isEfficacy ? 'Self-Efficacy Check' : 'App Feedback'}
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
                <div className="px-6 py-4 border-b shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: "#333333" }}>
                            Question {currentQuestions.length > 0 ? currentQuestionIndex + 1 : 0} of {currentQuestions.length}
                        </span>
                        <span className="text-sm" style={{ color: "#20B2AA" }}>
                            {currentQuestions.length > 0 ? Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100) : 0}%
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                width: `${currentQuestions.length > 0 ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100 : 0}%`,
                                backgroundColor: "#20B2AA"
                            }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto grow">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B2AA]"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button onClick={() => loadData()} variant="outline">
                                Try Again
                            </Button>
                        </div>
                    ) : currentQuestion ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4" style={{ color: "#1C3B5E" }}>
                                    {currentQuestion.question_text}
                                </h3>

                                {/* Multiple Choice (used for feedback too) */}
                                {(currentQuestion.question_type === 'multiple_choice' || !currentQuestion.question_type) && currentQuestion.options && (
                                    <div className="space-y-3">
                                        {currentQuestion.options.map((option, index) => (
                                            <label
                                                key={index}
                                                className="flex items-center p-4 border rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
                                                style={{
                                                    borderColor: currentResponses[currentQuestion.id] === option ? "#20B2AA" : "#e5e7eb",
                                                    backgroundColor: currentResponses[currentQuestion.id] === option ? "#20B2AA10" : "transparent"
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuestion.id}`}
                                                    value={option}
                                                    checked={currentResponses[currentQuestion.id] === option}
                                                    onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value, !isEfficacy)}
                                                    className="sr-only"
                                                />
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${currentResponses[currentQuestion.id] === option
                                                        ? "border-[#20B2AA] bg-[#20B2AA]"
                                                        : "border-gray-300"
                                                        }`}
                                                >
                                                    {currentResponses[currentQuestion.id] === option && (
                                                        <div className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <span className="text-sm" style={{ color: "#333333" }}>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t shrink-0">
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
                        <Button
                            onClick={isEfficacy ? submitEfficacy : submitFeedback}
                            disabled={!isLastQuestion || !canGoNext || isSubmitting}
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
                                    {isEfficacy ? 'Next Step' : 'Submit Feedback'}
                                    {!isEfficacy && <CheckCircle className="w-4 h-4 ml-2" />}
                                    {isEfficacy && <ChevronRight className="w-4 h-4 ml-2" />}
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
