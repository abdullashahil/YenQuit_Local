import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import {
  getCopingStrategies,
  createCopingStrategy,
  updateCopingStrategy,
  softDeleteCopingStrategy,
  CopingStrategy
} from '../../services/assistService';

export default function CopingStrategiesPage() {
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      setLoading(true);
      const data = await getCopingStrategies(false); // Include inactive ones for admin
      setStrategies(data);
    } catch (error) {
      console.error('Error loading coping strategies:', error);
      alert('Failed to load strategies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert('Strategy name is required');
      return;
    }

    try {
      setSaving(true);
      await createCopingStrategy({
        name: formData.name.trim(),
        description: formData.description.trim() || null
      });
      
      // Reset form
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      
      // Reload strategies
      await loadStrategies();
    } catch (error) {
      console.error('Error creating strategy:', error);
      alert('Failed to create strategy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.name.trim()) {
      alert('Strategy name is required');
      return;
    }

    try {
      setSaving(true);
      await updateCopingStrategy(id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null
      });
      
      setEditing(null);
      setFormData({ name: '', description: '' });
      
      await loadStrategies();
    } catch (error) {
      console.error('Error updating strategy:', error);
      alert('Failed to update strategy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this strategy?')) {
      return;
    }

    try {
      setSaving(true);
      await softDeleteCopingStrategy(id);
      await loadStrategies();
    } catch (error) {
      console.error('Error deleting strategy:', error);
      alert('Failed to delete strategy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (strategy: CopingStrategy) => {
    setEditing(strategy.id);
    setFormData({
      name: strategy.name,
      description: strategy.description || ''
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20B2AA]" />
          <p>Loading strategies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coping Strategies Management</h1>
          <p className="text-gray-600">Manage coping strategies available to users in the ASSIST step</p>
        </div>

        <div className="mb-6">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Strategy
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6 border-[#20B2AA]">
            <CardHeader>
              <CardTitle>Create New Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-name">Strategy Name *</Label>
                  <Input
                    id="create-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Deep breathing exercises"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="create-description">Description</Label>
                  <Textarea
                    id="create-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the strategy..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreate}
                    disabled={saving}
                    className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Create Strategy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormData({ name: '', description: '' });
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
            <Card key={strategy.id} className={!strategy.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                {editing === strategy.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`edit-name-${strategy.id}`}>Strategy Name *</Label>
                      <Input
                        id={`edit-name-${strategy.id}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-description-${strategy.id}`}>Description</Label>
                      <Textarea
                        id={`edit-description-${strategy.id}`}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleUpdate(strategy.id)}
                        disabled={saving}
                        className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
                      >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{strategy.name}</h3>
                        <Badge variant={strategy.is_active ? 'default' : 'secondary'}>
                          {strategy.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {strategy.description && (
                        <p className="text-gray-600 mb-2">{strategy.description}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Created: {new Date(strategy.created_at).toLocaleDateString()} | 
                        Updated: {new Date(strategy.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(strategy)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(strategy.id)}
                        disabled={saving}
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

        {strategies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No coping strategies found. Create your first strategy above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
