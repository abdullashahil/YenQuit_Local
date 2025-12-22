import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { X, Upload, Image, Video, FileText, Calendar, Tag, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface AddContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editContent?: any;
  onContentSaved?: (content: any) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AddContentModal({ open, onOpenChange, editContent, onContentSaved }: AddContentModalProps) {
  const [title, setTitle] = useState(editContent?.title || "");
  const [category, setCategory] = useState(editContent?.category || "");
  const [content, setContent] = useState(editContent?.content || "");
  const [publishDate, setPublishDate] = useState(editContent?.publish_date || "");
  const [endDate, setEndDate] = useState(editContent?.end_date || "");
  const [mediaUrl, setMediaUrl] = useState(editContent?.media_url || "");
  const [tags, setTags] = useState(editContent?.tags?.join(', ') || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'category' | 'details'>('category');

  // Reset step when modal opens/closes
  useEffect(() => {
    if (open) {
      if (editContent?.category) {
        setCategory(editContent.category);
        setStep('details');
      } else {
        setStep('category');
      }
    }
  }, [open, editContent]);

  const handleSave = async () => {
    setError(null);

    // Validation based on category
    if (!category) {
      setError('Category is required');
      return;
    }

    // Category-specific validation
    if (category === 'Video' || category === 'Podcast') {
      if (!title.trim()) {
        setError('Title is required for video/podcast content');
        return;
      }
      if (!mediaUrl.trim()) {
        setError('Video URL is required for video/podcast content');
        return;
      }
    } else if (category === 'Image') {
      if (!mediaUrl.trim() && !selectedFile) {
        setError('Either an image URL or uploaded file is required for image-based learning');
        return;
      }
    } else if (category === 'Blog' || category === 'Quote') {
      if (!title.trim()) {
        setError('Title is required for blog/quote content');
        return;
      }
      if (!content.trim()) {
        setError('Content is required for blog/quote content');
        return;
      }
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('description', '');
      formData.append('content', content.trim());
      formData.append('status', 'Live');
      formData.append('publish_date', publishDate);
      formData.append('end_date', endDate);
      formData.append('media_url', mediaUrl);

      // Parse tags
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      formData.append('tags', JSON.stringify(tagsArray));

      // Add file if selected
      if (selectedFile) {
        formData.append('media', selectedFile);
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      console.log('title:', title.trim());
      console.log('category:', category);
      console.log('media_url:', mediaUrl);
      console.log('selectedFile:', selectedFile ? selectedFile.name : 'No file selected');
      console.log('selectedFile size:', selectedFile ? selectedFile.size : 'N/A');

      const url = editContent?.id
        ? `${API_BASE_URL}/content/${editContent.id}`
        : `${API_BASE_URL}/content`;

      const method = editContent?.id ? 'put' : 'post';

      const response = await axios[method](url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Reset form and step
        if (!editContent) {
          setTitle("");
          setCategory("");
          setContent("");
          setPublishDate("");
          setEndDate("");
          setMediaUrl("");
          setTags("");
          setSelectedFile(null);
          setStep('category');
        }

        // Call success callback if provided
        if (onContentSaved) {
          onContentSaved(response.data.data);
        }

        onOpenChange(false);

        // Show success message (you could use a toast library here)
        console.log(editContent ? 'Content updated successfully!' : 'Content created successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save content');
      console.error('Error saving content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setStep('details');
    setError(null);
  };

  const handleBackToCategory = () => {
    setStep('category');
    // Reset form fields
    setContent("");
    setMediaUrl("");
    setTags("");
    setSelectedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only PNG, JPG, MP4, and PDF files are allowed.');
        return;
      }

      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 10MB.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      console.log("File selected:", file.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 rounded-3xl border-0 overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#20B2AA] to-[#1C9B94] shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1C3B5E]">
                  {editContent ? "Edit Content" : "Create New Content"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {editContent ? "Update existing content" : "Add new content to Learning Hub and campaigns"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {step === 'category' ? (
            /* Category Selection Step */
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-[#1C3B5E]">Choose Content Type</h3>
                <p className="text-gray-600">Select the type of content you want to create</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => handleCategorySelect('Video')}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-left group"
                >
                  <Video className="w-8 h-8 text-red-500 mb-3" />
                  <h4 className="font-semibold text-[#1C3B5E] mb-2">Video Content</h4>
                </button>

                <button
                  onClick={() => handleCategorySelect('Podcast')}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group"
                >
                  <FileText className="w-8 h-8 text-purple-500 mb-3" />
                  <h4 className="font-semibold text-[#1C3B5E] mb-2">Podcast</h4>
                </button>

                <button
                  onClick={() => handleCategorySelect('Image')}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
                >
                  <Image className="w-8 h-8 text-green-500 mb-3" />
                  <h4 className="font-semibold text-[#1C3B5E] mb-2">Image-Based Learning</h4>
                </button>

                <button
                  onClick={() => handleCategorySelect('Blog')}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                >
                  <FileText className="w-8 h-8 text-blue-500 mb-3" />
                  <h4 className="font-semibold text-[#1C3B5E] mb-2">Blog Article</h4>
                </button>

                {/* <button
                  onClick={() => handleCategorySelect('Quote')}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-left group"
                >
                  <Quote className="w-8 h-8 text-yellow-500 mb-3" />
                  <h4 className="font-semibold text-[#1C3B5E] mb-2">Motivational Quote</h4>
                </button> */}
              </div>
            </div>
          ) : (
            /* Category-specific form fields */
            <div className="space-y-6">
              {/* Back button and category display */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToCategory}
                  className="px-4 py-2 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-sm"
                >
                  ← Back to Categories
                </button>
                <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {category}
                </div>
              </div>

              {/* Video/Podcast Fields */}
              {(category === 'Video' || category === 'Podcast') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a compelling title..."
                        className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        YouTube URL <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">

                  </div>
                </div>
              )}

              {/* Image-Based Learning Fields */}
              {category === 'Image' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Title
                        </Label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter a title for the image (optional)..."
                          className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Image Source
                        </Label>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="imageSource"
                                checked={!mediaUrl}
                                onChange={() => {
                                  setMediaUrl("");
                                  setSelectedFile(null);
                                }}
                                className="text-[#20B2AA]"
                              />
                              <span className="text-sm text-gray-700">Upload Image</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="imageSource"
                                checked={mediaUrl && !selectedFile}
                                onChange={() => {
                                  setSelectedFile(null);
                                }}
                                className="text-[#20B2AA]"
                              />
                              <span className="text-sm text-gray-700">Image URL</span>
                            </label>
                          </div>

                          {!mediaUrl ? (
                            <div className="space-y-3">
                              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#20B2AA] transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600">
                                    {selectedFile ? selectedFile.name : "Click to upload image"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG up to 10MB
                                  </p>
                                </label>
                              </div>
                              {selectedFile && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                                  <Image className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-green-700">{selectedFile.name}</span>
                                  <button
                                    onClick={() => setSelectedFile(null)}
                                    className="ml-auto text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Input
                                value={mediaUrl}
                                onChange={(e) => setMediaUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Blog/Quote Fields */}
              {(category === 'Blog' || category === 'Quote') && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter a compelling title..."
                          className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Tags
                        </Label>
                        <Input
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="Enter tags separated by commas..."
                          className="rounded-2xl border-gray-200 h-12"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-[#1C3B5E]">
                      {category === 'Blog' ? 'Content' : 'Quote Text'} <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={category === 'Blog' ? "Write your full blog post here..." : "Enter the motivational quote..."}
                      className="rounded-2xl border-gray-200 min-h-48 resize-none focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'details' && (
          <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Auto-save enabled
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onOpenChange(false)}
                className="px-8 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="px-8 py-3 rounded-2xl text-white transition-all duration-200 hover:shadow-lg shadow-md disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #20B2AA 0%, #1C9B94 100%)"
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editContent ? "Updating..." : "Publishing..."}
                  </span>
                ) : (
                  editContent ? "Update Content" : "Publish Content"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}