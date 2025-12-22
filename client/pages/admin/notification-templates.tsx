import React, { useState, useEffect } from 'react';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Label } from '../../src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import {
  getNotificationTemplates,
  createNotificationTemplate,
  updateNotificationTemplate,
  softDeleteNotificationTemplate,
  NotificationTemplate
} from '../../src/services/assistService';

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    default_time: ''
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getNotificationTemplates(false); // Include inactive ones for admin
      setTemplates(data);
    } catch (error) {
      console.error('Error loading notification templates:', error);
      alert('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.key.trim() || !formData.title.trim()) {
      alert('Template key and title are required');
      return;
    }

    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.default_time)) {
      alert('Default time must be in HH:MM format (e.g., 09:00)');
      return;
    }

    try {
      setSaving(true);
      await createNotificationTemplate({
        key: formData.key.trim(),
        title: formData.title.trim(),
        default_time: formData.default_time.trim() || null
      });

      // Reset form
      setFormData({ key: '', title: '', default_time: '' });
      setShowCreateForm(false);

      // Reload templates
      await loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.key.trim() || !formData.title.trim()) {
      alert('Template key and title are required');
      return;
    }

    if (formData.default_time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.default_time)) {
      alert('Default time must be in HH:MM format (e.g., 09:00)');
      return;
    }

    try {
      setSaving(true);
      await updateNotificationTemplate(id, {
        key: formData.key.trim(),
        title: formData.title.trim(),
        default_time: formData.default_time.trim() || null
      });

      setEditing(null);
      setFormData({ key: '', title: '', default_time: '' });

      await loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this template?')) {
      return;
    }

    try {
      setSaving(true);
      await softDeleteNotificationTemplate(id);
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (template: NotificationTemplate) => {
    setEditing(template.id);
    setFormData({
      key: template.key,
      title: template.title,
      default_time: template.default_time || ''
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({ key: '', title: '', default_time: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20B2AA]" />
          <p>Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Templates Management</h1>
          <p className="text-gray-600">Manage notification templates available to users in the ASSIST step</p>
        </div>

        <div className="mb-6">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Template
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6 border-[#20B2AA]">
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-key">Template Key *</Label>
                  <Input
                    id="create-key"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    placeholder="e.g., daily_motivation"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Unique identifier for the template (no spaces)</p>
                </div>
                <div>
                  <Label htmlFor="create-title">Template Title *</Label>
                  <Input
                    id="create-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Daily Motivational Reminder"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="create-time">Default Time</Label>
                  <Input
                    id="create-time"
                    type="time"
                    value={formData.default_time}
                    onChange={(e) => setFormData({ ...formData, default_time: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Default notification time in HH:MM format</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreate}
                    disabled={saving}
                    className="bg-[#20B2AA] hover:bg-[#20B2AA]/90"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Create Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormData({ key: '', title: '', default_time: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Templates List */}
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className={!template.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                {editing === template.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`edit-key-${template.id}`}>Template Key *</Label>
                      <Input
                        id={`edit-key-${template.id}`}
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-title-${template.id}`}>Template Title *</Label>
                      <Input
                        id={`edit-title-${template.id}`}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-time-${template.id}`}>Default Time</Label>
                      <Input
                        id={`edit-time-${template.id}`}
                        type="time"
                        value={formData.default_time}
                        onChange={(e) => setFormData({ ...formData, default_time: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleUpdate(template.id)}
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
                        <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                        <Badge variant={template.is_active ? 'default' : 'secondary'}>
                          {template.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-1 mb-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Key:</span> {template.key}
                        </p>
                        {template.default_time && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Default Time:</span> {template.default_time}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(template.created_at).toLocaleDateString()} |
                        Updated: {new Date(template.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
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

        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No notification templates found. Create your first template above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
