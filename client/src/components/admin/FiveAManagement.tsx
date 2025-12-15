import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2, Plus, Edit, Trash2, Save, X, MessageCircle, Lightbulb, ClipboardCheck, Users, Calendar, Heart } from 'lucide-react';
import {
  getCopingStrategies,
  createCopingStrategy,
  updateCopingStrategy,
  softDeleteCopingStrategy,
  CopingStrategy
} from '../../services/assistService';
import {
  getAssessmentQuestions,
  createAssessmentQuestion,
  updateAssessmentQuestion,
  softDeleteAssessmentQuestion,
  AssessmentQuestion,
  CreateAssessmentQuestionRequest,
  UpdateAssessmentQuestionRequest
} from '../../services/assessmentService';

interface FiveAManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function FiveAManagement({ activeTab, setActiveTab }: FiveAManagementProps) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [allQuestions, setAllQuestions] = useState<AssessmentQuestion[]>([]);
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [tobaccoCategory, setTobaccoCategory] = useState<'smoked' | 'smokeless'>('smoked');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [editingStrategy, setEditingStrategy] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateStrategyForm, setShowCreateStrategyForm] = useState(false);
  const [activeStep, setActiveStep] = useState<'ask' | 'assess' | 'assist'>('ask');
  const [formData, setFormData] = useState({
    question_text: '',
    options: [''],
    step: 'ask' as 'ask' | 'assess' | 'assist',
    tobacco_category: 'smoked' as 'smoked' | 'smokeless',
    question_type: 'radio' as 'radio' | 'text' | 'textarea' | 'checkbox',
    display_order: 1
  });
  const [strategyFormData, setStrategyFormData] = useState({
    name: '',
    description: ''
  });

  const stepIcons = {
    ask: MessageCircle,
    assess: ClipboardCheck,
    assist: Users,
  };

  const stepTitles = {
    ask: 'ASK Questions',
    assess: 'ASSESS Questions',
    assist: 'ASSIST Strategies',
  };

  useEffect(() => {
    loadAssessmentContent();
  }, [activeStep, tobaccoCategory]);

  useEffect(() => {
    // Preload all questions when component mounts
    loadAllQuestions();
  }, []);

  const loadAllQuestions = async () => {
    try {
      const response = await getAssessmentQuestions('ask', 'smoked', true); // Get all questions
      setAllQuestions(response.questions || []);
    } catch (error) {
      console.error('Error loading all questions:', error);
    }
  };

  const filterQuestionsByStepAndCategory = () => {
    const filtered = allQuestions.filter(q => 
      q.metadata.step === activeStep && 
      q.metadata.tobacco_category === tobaccoCategory
    );
    setQuestions(filtered);
  };

  useEffect(() => {
    filterQuestionsByStepAndCategory();
  }, [tobaccoCategory, activeStep, allQuestions]);

  const loadAssessmentContent = async () => {
    try {
      setLoading(true);
      
      if (activeStep === 'assist') {
        // Load coping strategies for ASSIST step
        const data = await getCopingStrategies(false); // Include inactive ones for admin
        setStrategies(data);
        setQuestions([]);
      } else {
        // Load questions for the current step
        const response = await getAssessmentQuestions(activeStep, tobaccoCategory, true);
        setQuestions(response.questions || []);
        setStrategies([]);
      }
    } catch (error) {
      console.error('Error loading assessment content:', error);
      alert('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    if (!formData.question_text.trim()) {
      alert('Question text is required');
      return;
    }

    try {
      setSaving(true);
      await createAssessmentQuestion({
        question_text: formData.question_text.trim(),
        options: formData.options.filter(o => o.trim()),
        step: formData.step,
        tobacco_category: formData.tobacco_category,
        question_type: formData.question_type,
        display_order: formData.display_order
      });
      
      // Reset form
      setFormData({
        question_text: '',
        options: [''],
        step: activeStep,
        tobacco_category: tobaccoCategory,
        question_type: 'radio' as 'radio' | 'text' | 'textarea' | 'checkbox',
        display_order: 1
      });
      setShowCreateForm(false);
      
      // Reload questions
      await loadAllQuestions();
      await loadAssessmentContent();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Failed to create question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuestion = async (id: number) => {
    if (!formData.question_text.trim()) {
      alert('Question text is required');
      return;
    }

    try {
      setSaving(true);
      await updateAssessmentQuestion(id, {
        question_text: formData.question_text.trim(),
        options: formData.options.filter(o => o.trim()),
        step: formData.step,
        tobacco_category: formData.tobacco_category,
        question_type: formData.question_type,
        display_order: formData.display_order
      });
      
      setEditing(null);
      
      // Reset form
      setFormData({
        question_text: '',
        options: [''],
        step: activeStep,
        tobacco_category: tobaccoCategory,
        question_type: 'radio' as 'radio' | 'text' | 'textarea' | 'checkbox',
        display_order: 1
      });
      
      // Reload questions
      await loadAllQuestions();
      await loadAssessmentContent();
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to update question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    try {
      await softDeleteAssessmentQuestion(id);
      await loadAllQuestions();
      await loadAssessmentContent();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question. Please try again.');
    }
  };

  const handleEditQuestion = (question: AssessmentQuestion) => {
    setEditing(question.id);
    setFormData({
      question_text: question.question_text,
      options: question.options || [''],
      step: question.metadata.step,
      tobacco_category: question.metadata.tobacco_category,
      question_type: question.question_type || 'radio' as 'radio' | 'text' | 'textarea' | 'checkbox',
      display_order: question.display_order || 1
    });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setFormData({
      question_text: '',
      options: [''],
      step: activeStep,
      tobacco_category: tobaccoCategory,
      question_type: 'radio' as 'radio' | 'text' | 'textarea' | 'checkbox',
      display_order: 1
    });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  // Strategy handlers
  const handleCreateStrategy = async () => {
    if (!strategyFormData.name.trim()) {
      alert('Strategy name is required');
      return;
    }

    try {
      setSaving(true);
      await createCopingStrategy({
        name: strategyFormData.name.trim(),
        description: strategyFormData.description.trim() || null
      });
      
      // Reset form
      setStrategyFormData({ name: '', description: '' });
      setShowCreateStrategyForm(false);
      
      // Reload strategies
      await loadAssessmentContent();
    } catch (error) {
      console.error('Error creating strategy:', error);
      alert('Failed to create strategy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStrategy = async (id: number) => {
    if (!strategyFormData.name.trim()) {
      alert('Strategy name is required');
      return;
    }

    try {
      setSaving(true);
      await updateCopingStrategy(id, {
        name: strategyFormData.name.trim(),
        description: strategyFormData.description.trim() || null
      });
      
      setEditingStrategy(null);
      setStrategyFormData({ name: '', description: '' });
      
      await loadAssessmentContent();
    } catch (error) {
      console.error('Error updating strategy:', error);
      alert('Failed to update strategy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStrategy = async (id: number) => {
    if (!confirm('Are you sure you want to delete this strategy?')) {
      return;
    }

    try {
      setSaving(true);
      await softDeleteCopingStrategy(id);
      await loadAssessmentContent();
    } catch (error) {
      console.error('Error deleting strategy:', error);
      alert('Failed to delete strategy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditStrategy = (strategy: CopingStrategy) => {
    setEditingStrategy(strategy.id);
    setStrategyFormData({
      name: strategy.name,
      description: strategy.description || ''
    });
  };

  const handleCancelStrategyEdit = () => {
    setEditingStrategy(null);
    setStrategyFormData({ name: '', description: '' });
  };

  const StepIcon = stepIcons[activeStep];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20B2AA]" />
          <p className="text-gray-600">Loading {stepTitles[activeStep]}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1C3B5E] mb-2">5A Content Management</h2>
          <p className="text-gray-600">Manage content for each step of the 5A methodology</p>
        </div>
      </div>

      <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ask" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            ASK
          </TabsTrigger>
          <TabsTrigger value="assess" className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            ASSESS
          </TabsTrigger>
          <TabsTrigger value="assist" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            ASSIST
          </TabsTrigger>
        </TabsList>

        {/* ASK Questions */}
        <TabsContent value="ask" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#20B2AA]" />
              <h3 className="text-xl font-semibold">ASK Questions</h3>
            </div>
            <div className="flex items-center gap-2">
              {activeStep === 'ask' && (
                <Select value={tobaccoCategory} onValueChange={(value: any) => setTobaccoCategory(value)}>
                  <SelectTrigger className="w-40 bg-white border-gray-300">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 shadow-lg">
                    <SelectItem value="smoked" className="text-gray-900 hover:bg-gray-100">Smoked</SelectItem>
                    <SelectItem value="smokeless" className="text-gray-900 hover:bg-gray-100">Smokeless</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="h-10 rounded-xl flex items-center gap-2 px-4"
                style={{ 
                  background: "linear-gradient(135deg, #20B2AA 0%, #1C9B94 100%)",
                  color: "white" 
                }}
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editing !== null) && (
            <Card className="border-[#20B2AA] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#20B2AA]" />
                  {editing ? 'Edit Question' : 'Create New Question'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question-text">Question Text *</Label>
                    <Textarea
                      id="question-text"
                      value={formData.question_text}
                      onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                      placeholder="Enter your question..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="question-type">Question Type</Label>
                      <Select
                        value={formData.question_type}
                        onValueChange={(value) => setFormData({ ...formData, question_type: value as any })}
                      >
                        <SelectTrigger className="mt-1 bg-white border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-lg">
                          <SelectItem value="textarea" className="text-gray-900 hover:bg-gray-100">Text Area</SelectItem>
                          <SelectItem value="radio" className="text-gray-900 hover:bg-gray-100">Multiple Choice</SelectItem>
                          <SelectItem value="text" className="text-gray-900 hover:bg-gray-100">Short Text</SelectItem>
                          <SelectItem value="checkbox" className="text-gray-900 hover:bg-gray-100">Checkboxes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="display-order">Display Order</Label>
                      <Input
                        id="display-order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                        className="mt-1"
                        min="1"
                      />
                    </div>
                  </div>

                  {formData.question_type === 'radio' && (
                    <div>
                      <Label>Options</Label>
                      <div className="space-y-2 mt-1">
                        {formData.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            />
                            {formData.options.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addOption}
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      onClick={editing ? () => handleUpdateQuestion(editing) : handleCreateQuestion}
                      disabled={saving}
                      className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      {editing ? 'Update Question' : 'Create Question'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={editing ? handleCancelEdit : () => {
                        setShowCreateForm(false);
                        setFormData({
                          question_text: '',
                          options: [''],
                          step: activeStep,
                          tobacco_category: tobaccoCategory,
                          question_type: 'radio' as 'radio' | 'text' | 'textarea' | 'checkbox',
                          display_order: 1
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questions List */}
          <div className="grid gap-4">
            {questions.map((question) => (
              <Card key={question.id} className={!question.is_active ? 'opacity-60' : 'shadow-sm hover:shadow-md transition-shadow'}>
                <CardContent className="p-6">
                  {editing === question.id ? (
                    // Edit form is handled above
                    null
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{question.question_type}</Badge>
                            <Badge variant="secondary">{question.metadata.tobacco_category}</Badge>
                            {!question.is_active && <Badge variant="destructive">Inactive</Badge>}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{question.question_text}</h4>
                          
                          {question.options && question.options.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-700">Options:</p>
                              <div className="flex flex-wrap gap-2">
                                {question.options.map((option, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ASSESS Questions */}
        <TabsContent value="assess" className="space-y-6">
          {/* 5A Assess Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#20B2AA]" />
                <h3 className="text-xl font-semibold">ASSESS Questions (5A Methodology)</h3>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="h-10 rounded-xl flex items-center gap-2 px-4"
                style={{ 
                  background: "linear-gradient(135deg, #20B2AA 0%, #1C9B94 100%)",
                  color: "white" 
                }}
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            {/* Create Question Form */}
            {showCreateForm && (
              <Card className="border-[#20B2AA] shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-[#20B2AA]" />
                    Create New ASSESS Question
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="assess-question-text">Question Text *</Label>
                      <Textarea
                        id="assess-question-text"
                        value={formData.question_text}
                        onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                        placeholder="Enter your assessment question..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="assess-question-type">Question Type *</Label>
                      <Select value={formData.question_type} onValueChange={(value: any) => setFormData({ ...formData, question_type: value })}>
                        <SelectTrigger className="mt-1 bg-white border-gray-300">
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 shadow-lg">
                          <SelectItem value="radio" className="text-gray-900 hover:bg-gray-100">Multiple Choice</SelectItem>
                          <SelectItem value="checkbox" className="text-gray-900 hover:bg-gray-100">Checkboxes</SelectItem>
                          <SelectItem value="text" className="text-gray-900 hover:bg-gray-100">Short Text</SelectItem>
                          <SelectItem value="textarea" className="text-gray-900 hover:bg-gray-100">Long Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.question_type === 'radio' || formData.question_type === 'checkbox' ? (
                      <div>
                        <Label>Options *</Label>
                        {formData.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2 mt-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              className="flex-1"
                            />
                            {formData.options.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={addOption}
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    ) : null}
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCreateQuestion}
                        disabled={saving}
                        className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
                      >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Create Question
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false);
                          setFormData({
                            question_text: '',
                            question_type: 'radio' as 'radio' | 'text' | 'textarea' | 'checkbox',
                            options: [''],
                            step: 'assess',
                            display_order: 1
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Questions List */}
            <div className="grid gap-4">
              {questions.map((question) => (
                <Card key={question.id} className={!question.is_active ? 'opacity-60' : 'shadow-sm hover:shadow-md transition-shadow'}>
                  <CardContent className="p-6">
                    {editing === question.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`edit-question-text-${question.id}`}>Question Text *</Label>
                          <Textarea
                            id={`edit-question-text-${question.id}`}
                            value={formData.question_text}
                            onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Options *</Label>
                          {formData.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 mt-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-1"
                              />
                              {formData.options.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeOption(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={addOption}
                            className="mt-2"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleUpdateQuestion(question.id)}
                            disabled={saving}
                            className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
                          >
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Update Question
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display View
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{question.metadata.tobacco_category}</Badge>
                              {!question.is_active && <Badge variant="destructive">Inactive</Badge>}
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">{question.question_text}</h4>
                            {question.options && question.options.length > 0 && (
                              <div className="space-y-1">
                                {question.options.map((option, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>{index + 1}.</span>
                                    <span>{option}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditQuestion(question)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ASSIST Strategies */}
        <TabsContent value="assist" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#20B2AA]" />
                <h3 className="text-xl font-semibold">ASSIST Strategies</h3>
              </div>
              <Button
                onClick={() => setShowCreateStrategyForm(!showCreateStrategyForm)}
                className="h-10 rounded-xl flex items-center gap-2 px-4"
                style={{ 
                  background: "linear-gradient(135deg, #20B2AA 0%, #1C9B94 100%)",
                  color: "white" 
                }}
              >
                <Plus className="w-4 h-4" />
                Add Strategy
              </Button>
            </div>

            {/* Create Strategy Form */}
            {showCreateStrategyForm && (
              <Card className="border-[#20B2AA] shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#20B2AA]" />
                    Create New Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="create-strategy-name">Strategy Name *</Label>
                      <Input
                        id="create-strategy-name"
                        value={strategyFormData.name}
                        onChange={(e) => setStrategyFormData({ ...strategyFormData, name: e.target.value })}
                        placeholder="e.g., Deep breathing exercises"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="create-strategy-description">Description</Label>
                      <Textarea
                        id="create-strategy-description"
                        value={strategyFormData.description}
                        onChange={(e) => setStrategyFormData({ ...strategyFormData, description: e.target.value })}
                        placeholder="Brief description of the strategy..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCreateStrategy}
                        disabled={saving}
                        className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
                      >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Create Strategy
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateStrategyForm(false);
                          setStrategyFormData({ name: '', description: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Strategies List */}
            <div className="grid gap-4">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className={!strategy.is_active ? 'opacity-60' : 'shadow-sm hover:shadow-md transition-shadow'}>
                  <CardContent className="p-6">
                    {editingStrategy === strategy.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`edit-strategy-name-${strategy.id}`}>Strategy Name *</Label>
                          <Input
                            id={`edit-strategy-name-${strategy.id}`}
                            value={strategyFormData.name}
                            onChange={(e) => setStrategyFormData({ ...strategyFormData, name: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-strategy-description-${strategy.id}`}>Description</Label>
                          <Textarea
                            id={`edit-strategy-description-${strategy.id}`}
                            value={strategyFormData.description}
                            onChange={(e) => setStrategyFormData({ ...strategyFormData, description: e.target.value })}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleUpdateStrategy(strategy.id)}
                            disabled={saving}
                            className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
                          >
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Update Strategy
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelStrategyEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display View
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Strategy</Badge>
                              {!strategy.is_active && <Badge variant="destructive">Inactive</Badge>}
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">{strategy.name}</h4>
                            {strategy.description && (
                              <p className="text-gray-600 text-sm">{strategy.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStrategy(strategy)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStrategy(strategy.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>
        </Tabs>
    </div>
  );
}
