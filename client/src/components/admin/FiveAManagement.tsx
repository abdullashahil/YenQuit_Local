import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2, Plus, Edit, Trash2, Save, X, MessageCircle, ClipboardCheck, Users, Activity } from 'lucide-react';
import {
  getCopingStrategies,
  createCopingStrategy,
  updateCopingStrategy,
  softDeleteCopingStrategy,
  CopingStrategy
} from '../../services/assistService';
import {
  getAssessmentQuestions,
  getAllAssessmentQuestions,
  getFagerstromQuestions,
  getAllFagerstromQuestions,
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
  // State management
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [allFiveAQuestions, setAllFiveAQuestions] = useState<AssessmentQuestion[]>([]);
  const [allFagerstromQuestions, setAllFagerstromQuestions] = useState<AssessmentQuestion[]>([]);
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [tobaccoFilter, setTobaccoFilter] = useState<'smoked' | 'smokeless'>('smoked');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [editingStrategy, setEditingStrategy] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateStrategyForm, setShowCreateStrategyForm] = useState(false);
  const [currentTab, setCurrentTab] = useState<'ask' | 'assess' | 'assist' | 'fagerstrom'>('ask');

  const [formData, setFormData] = useState({
    question_text: '',
    options: [''],
    step: 'ask' as 'ask' | 'assess' | 'assist',
    tobacco_category: 'smoked' as 'smoked' | 'smokeless',
    question_type: 'multiple_choice' as 'multiple_choice' | 'checkboxes' | 'short_text' | 'long_text',
    display_order: 1,
    category: 'fivea' as 'fivea' | 'fagerstrom'
  });

  const [strategyFormData, setStrategyFormData] = useState({
    name: '',
    description: ''
  });

  // Load all questions on mount
  useEffect(() => {
    loadAllQuestions();
  }, []);

  // Filter questions when tab or tobacco filter changes
  useEffect(() => {
    filterQuestions();
  }, [currentTab, tobaccoFilter, allFiveAQuestions, allFagerstromQuestions]);

  const loadAllQuestions = async () => {
    try {
      setLoading(true);

      // Load all 5A questions
      const fiveAResponse = await getAllAssessmentQuestions(true);
      setAllFiveAQuestions(fiveAResponse.questions || []);

      // Load all Fagerström questions
      const fagerstromResponse = await getAllFagerstromQuestions(true);
      setAllFagerstromQuestions(fagerstromResponse.questions || []);

    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    if (currentTab === 'assist') {
      loadStrategies();
      return;
    }

    if (currentTab === 'fagerstrom') {
      // Filter Fagerström questions by tobacco category
      const filtered = allFagerstromQuestions.filter(
        q => q.metadata.tobacco_category === tobaccoFilter
      );
      setQuestions(filtered);
    } else if (currentTab === 'assess') {
      // ASSESS: Show all questions regardless of tobacco category
      const filtered = allFiveAQuestions.filter(
        q => q.metadata.step === 'assess'
      );
      setQuestions(filtered);
    } else {
      // ASK: Filter by step and tobacco category
      const filtered = allFiveAQuestions.filter(
        q => q.metadata.step === currentTab && q.metadata.tobacco_category === tobaccoFilter
      );
      setQuestions(filtered);
    }
  };

  const loadStrategies = async () => {
    try {
      setLoading(true);
      const data = await getCopingStrategies(true); // Include inactive for admin
      setStrategies(data);
      setQuestions([]);
    } catch (error) {
      console.error('Error loading strategies:', error);
      alert('Failed to load strategies. Please try again.');
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

      const requestData: any = {
        question_text: formData.question_text.trim(),
        options: formData.options.filter(o => o.trim()),
        question_type: formData.question_type,
        display_order: formData.display_order,
        tobacco_category: formData.tobacco_category
      };

      // Add step only for 5A questions
      if (formData.category === 'fivea') {
        requestData.step = formData.step;
      }

      await createAssessmentQuestion(requestData);

      resetForm();
      setShowCreateForm(false);
      await loadAllQuestions();
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

      const requestData: any = {
        question_text: formData.question_text.trim(),
        options: formData.options.filter(o => o.trim()),
        question_type: formData.question_type,
        display_order: formData.display_order,
        tobacco_category: formData.tobacco_category
      };

      // Add step only for 5A questions
      if (formData.category === 'fivea') {
        requestData.step = formData.step;
      }

      await updateAssessmentQuestion(id, requestData);

      setEditing(null);
      resetForm();
      await loadAllQuestions();
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
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question. Please try again.');
    }
  };

  const handleEditQuestion = (question: AssessmentQuestion) => {
    console.log('Editing question:', question);
    console.log('Question type from DB:', question.question_type);

    setEditing(question.id);
    setFormData({
      question_text: question.question_text,
      options: question.options || [''],
      step: question.metadata.step || 'ask',
      tobacco_category: question.metadata.tobacco_category,
      question_type: question.question_type || 'short_text',
      display_order: question.display_order || 1,
      category: currentTab === 'fagerstrom' ? 'fagerstrom' : 'fivea'
    });
    setShowCreateForm(false);
  };

  const resetForm = () => {
    setFormData({
      question_text: '',
      options: [''],
      step: currentTab === 'fagerstrom' ? 'ask' : currentTab as 'ask' | 'assess' | 'assist',
      tobacco_category: tobaccoFilter,
      question_type: 'multiple_choice',
      display_order: 1,
      category: currentTab === 'fagerstrom' ? 'fagerstrom' : 'fivea'
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

      setStrategyFormData({ name: '', description: '' });
      setShowCreateStrategyForm(false);
      await loadStrategies();
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
      await loadStrategies();
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
      await softDeleteCopingStrategy(id);
      await loadStrategies();
    } catch (error) {
      console.error('Error deleting strategy:', error);
      alert('Failed to delete strategy. Please try again.');
    }
  };

  const handleEditStrategy = (strategy: CopingStrategy) => {
    setEditingStrategy(strategy.id);
    setStrategyFormData({
      name: strategy.name,
      description: strategy.description || ''
    });
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as any);
    setEditing(null);
    setShowCreateForm(false);
    setShowCreateStrategyForm(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20B2AA]" />
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  const showTobaccoFilter = currentTab !== 'assist';
  const isQuestionTab = currentTab !== 'assist';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1C3B5E] mb-2">5A Content Management</h2>
          <p className="text-gray-600">Manage assessment questions and coping strategies</p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="ask" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#20B2AA]">
            <MessageCircle className="w-4 h-4" />
            ASK
          </TabsTrigger>
          <TabsTrigger value="assess" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#20B2AA]">
            <ClipboardCheck className="w-4 h-4" />
            ASSESS
          </TabsTrigger>
          <TabsTrigger value="fagerstrom" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#20B2AA]">
            <Activity className="w-4 h-4" />
            Fagerström
          </TabsTrigger>
          <TabsTrigger value="assist" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#20B2AA]">
            <Users className="w-4 h-4" />
            ASSIST
          </TabsTrigger>
        </TabsList>

        {/* ASK Tab */}
        <TabsContent value="ask" className="space-y-4 mt-6">
          <QuestionTabContent
            title="ASK Questions"
            icon={MessageCircle}
            questions={questions}
            showTobaccoFilter={showTobaccoFilter}
            tobaccoFilter={tobaccoFilter}
            setTobaccoFilter={setTobaccoFilter}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            editing={editing}
            formData={formData}
            setFormData={setFormData}
            saving={saving}
            handleCreateQuestion={handleCreateQuestion}
            handleUpdateQuestion={handleUpdateQuestion}
            handleEditQuestion={handleEditQuestion}
            handleDeleteQuestion={handleDeleteQuestion}
            setEditing={setEditing}
            resetForm={resetForm}
            addOption={addOption}
            updateOption={updateOption}
            removeOption={removeOption}
          />
        </TabsContent>

        {/* ASSESS Tab */}
        <TabsContent value="assess" className="space-y-4 mt-6">
          <QuestionTabContent
            title="ASSESS Questions"
            icon={ClipboardCheck}
            questions={questions}
            showTobaccoFilter={false}
            tobaccoFilter={tobaccoFilter}
            setTobaccoFilter={setTobaccoFilter}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            editing={editing}
            formData={formData}
            setFormData={setFormData}
            saving={saving}
            handleCreateQuestion={handleCreateQuestion}
            handleUpdateQuestion={handleUpdateQuestion}
            handleEditQuestion={handleEditQuestion}
            handleDeleteQuestion={handleDeleteQuestion}
            setEditing={setEditing}
            resetForm={resetForm}
            addOption={addOption}
            updateOption={updateOption}
            removeOption={removeOption}
          />
        </TabsContent>

        {/* Fagerström Tab */}
        <TabsContent value="fagerstrom" className="space-y-4 mt-6">
          <QuestionTabContent
            title="Fagerström Test Questions"
            icon={Activity}
            questions={questions}
            showTobaccoFilter={showTobaccoFilter}
            tobaccoFilter={tobaccoFilter}
            setTobaccoFilter={setTobaccoFilter}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            editing={editing}
            formData={formData}
            setFormData={setFormData}
            saving={saving}
            handleCreateQuestion={handleCreateQuestion}
            handleUpdateQuestion={handleUpdateQuestion}
            handleEditQuestion={handleEditQuestion}
            handleDeleteQuestion={handleDeleteQuestion}
            setEditing={setEditing}
            resetForm={resetForm}
            addOption={addOption}
            updateOption={updateOption}
            removeOption={removeOption}
          />
        </TabsContent>

        {/* ASSIST Tab */}
        <TabsContent value="assist" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#20B2AA]" />
              <h3 className="text-xl font-semibold">ASSIST Strategies</h3>
            </div>
            <Button
              onClick={() => setShowCreateStrategyForm(!showCreateStrategyForm)}
              className="h-10 rounded-xl flex items-center gap-2 px-4 bg-[#20B2AA] hover:bg-[#1C9B94]"
            >
              <Plus className="w-4 h-4" />
              Add Strategy
            </Button>
          </div>

          {/* Create Strategy Form */}
          {showCreateStrategyForm && (
            <Card className="border-[#20B2AA] shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#20B2AA]/10 to-transparent">
                <CardTitle className="flex items-center gap-2 text-[#1C3B5E]">
                  <Users className="w-5 h-5 text-[#20B2AA]" />
                  Create New Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strategy-name">Strategy Name *</Label>
                    <Input
                      id="strategy-name"
                      value={strategyFormData.name}
                      onChange={(e) => setStrategyFormData({ ...strategyFormData, name: e.target.value })}
                      placeholder="e.g., Deep breathing exercises"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="strategy-description">Description</Label>
                    <Textarea
                      id="strategy-description"
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
                      className="bg-[#20B2AA] hover:bg-[#1C9B94]"
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
          {strategies.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No strategies found</p>
                <p className="text-sm text-gray-500">Click "Add Strategy" to create your first coping strategy</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className={`${!strategy.is_active ? 'opacity-60' : ''} shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#20B2AA]`}>
                  <CardContent className="p-6">
                    {editingStrategy === strategy.id ? (
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
                            className="bg-[#20B2AA] hover:bg-[#1C9B94]"
                          >
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Update Strategy
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingStrategy(null);
                              setStrategyFormData({ name: '', description: '' });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-[#20B2AA]/10 text-[#20B2AA] border-[#20B2AA]">Strategy</Badge>
                            {!strategy.is_active && <Badge variant="destructive">Inactive</Badge>}
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{strategy.name}</h4>
                          {strategy.description && (
                            <p className="text-gray-600 text-sm">{strategy.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditStrategy(strategy)}
                            className="hover:bg-[#20B2AA]/10 hover:text-[#20B2AA] hover:border-[#20B2AA]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStrategy(strategy.id)}
                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable Question Tab Component
interface QuestionTabContentProps {
  title: string;
  icon: React.ElementType;
  questions: AssessmentQuestion[];
  showTobaccoFilter: boolean;
  tobaccoFilter: 'smoked' | 'smokeless';
  setTobaccoFilter: (value: 'smoked' | 'smokeless') => void;
  showCreateForm: boolean;
  setShowCreateForm: (value: boolean) => void;
  editing: number | null;
  formData: any;
  setFormData: (value: any) => void;
  saving: boolean;
  handleCreateQuestion: () => void;
  handleUpdateQuestion: (id: number) => void;
  handleEditQuestion: (question: AssessmentQuestion) => void;
  handleDeleteQuestion: (id: number) => void;
  setEditing: (value: number | null) => void;
  resetForm: () => void;
  addOption: () => void;
  updateOption: (index: number, value: string) => void;
  removeOption: (index: number) => void;
}

function QuestionTabContent({
  title,
  icon: Icon,
  questions,
  showTobaccoFilter,
  tobaccoFilter,
  setTobaccoFilter,
  showCreateForm,
  setShowCreateForm,
  editing,
  formData,
  setFormData,
  saving,
  handleCreateQuestion,
  handleUpdateQuestion,
  handleEditQuestion,
  handleDeleteQuestion,
  setEditing,
  resetForm,
  addOption,
  updateOption,
  removeOption
}: QuestionTabContentProps) {
  return (
    <>
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#20B2AA]" />
          <h3 className="text-xl font-semibold">{title}</h3>
          {showTobaccoFilter && (
            <>
              <div className="h-6 w-px bg-gray-300" />
              <Select value={tobaccoFilter} onValueChange={(value: any) => setTobaccoFilter(value)}>
                <SelectTrigger className="w-40 bg-white border-gray-300 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-lg">
                  <SelectItem value="smoked" className="text-gray-900 hover:bg-gray-100">🚬 Smoked</SelectItem>
                  <SelectItem value="smokeless" className="text-gray-900 hover:bg-gray-100">🌿 Smokeless</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="bg-[#20B2AA]/10 text-[#20B2AA] border-[#20B2AA]">
                {questions.length} {questions.length === 1 ? 'question' : 'questions'}
              </Badge>
            </>
          )}
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="h-10 rounded-xl flex items-center gap-2 px-4 bg-[#20B2AA] hover:bg-[#1C9B94]"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editing !== null) && (
        <Card className="border-[#20B2AA] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#20B2AA]/10 to-transparent">
            <CardTitle className="flex items-center gap-2 text-[#1C3B5E]">
              <Icon className="w-5 h-5 text-[#20B2AA]" />
              {editing ? 'Edit Question' : 'Create New Question'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
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
                  <Label htmlFor="question-type">Question Type *</Label>
                  <Select
                    value={formData.question_type}
                    onValueChange={(value) => setFormData({ ...formData, question_type: value as any })}
                  >
                    <SelectTrigger className="mt-1 bg-white border-gray-300">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 shadow-lg">
                      <SelectItem value="multiple_choice" className="text-gray-900 hover:bg-gray-100">Multiple Choice</SelectItem>
                      <SelectItem value="checkboxes" className="text-gray-900 hover:bg-gray-100">Checkboxes</SelectItem>
                      <SelectItem value="short_text" className="text-gray-900 hover:bg-gray-100">Short Text</SelectItem>
                      <SelectItem value="long_text" className="text-gray-900 hover:bg-gray-100">Long Text</SelectItem>
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

              {(formData.question_type === 'multiple_choice' || formData.question_type === 'checkboxes') && (
                <div>
                  <Label>Options *</Label>
                  <div className="space-y-2 mt-1">
                    {formData.options.map((option: string, index: number) => (
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
                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-600"
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

              <div className="flex space-x-2 pt-2">
                <Button
                  onClick={editing ? () => handleUpdateQuestion(editing) : handleCreateQuestion}
                  disabled={saving}
                  className="bg-[#20B2AA] hover:bg-[#1C9B94]"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {editing ? 'Update Question' : 'Create Question'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (editing) {
                      setEditing(null);
                    } else {
                      setShowCreateForm(false);
                    }
                    resetForm();
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
      {questions.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="py-12 text-center">
            <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No questions found for {tobaccoFilter} tobacco</p>
            <p className="text-sm text-gray-500">Click "Add Question" to create your first question</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => (
            <Card key={question.id} className={`${!question.is_active ? 'opacity-60' : ''} shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#20B2AA]`}>
              <CardContent className="p-6">
                {editing === question.id ? null : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {question.question_type}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {question.metadata.tobacco_category}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Order: {question.display_order}
                        </Badge>
                        {!question.is_active && <Badge variant="destructive">Inactive</Badge>}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-3 text-lg">{question.question_text}</h4>

                      {question.options && question.options.length > 0 && (
                        <div className="space-y-2 mt-3">
                          <p className="text-sm font-medium text-gray-700">Options:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {question.options.map((option, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <span className="font-medium text-[#20B2AA]">{index + 1}.</span>
                                <span>{option}</span>
                              </div>
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
                        className="hover:bg-[#20B2AA]/10 hover:text-[#20B2AA] hover:border-[#20B2AA]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
