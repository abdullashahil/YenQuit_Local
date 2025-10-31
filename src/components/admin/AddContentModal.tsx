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
import { X, Upload, Image, Video, FileText, Calendar, Tag } from "lucide-react";
import { useState } from "react";

interface AddContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editContent?: any;
}

export function AddContentModal({ open, onOpenChange, editContent }: AddContentModalProps) {
  const [title, setTitle] = useState(editContent?.title || "");
  const [category, setCategory] = useState(editContent?.category || "");
  const [description, setDescription] = useState(editContent?.description || "");
  const [content, setContent] = useState(editContent?.content || "");
  const [status, setStatus] = useState(editContent?.status || "Draft");
  const [publishDate, setPublishDate] = useState(editContent?.publishDate || "");
  const [endDate, setEndDate] = useState(editContent?.endDate || "");
  const [mediaUrl, setMediaUrl] = useState(editContent?.mediaUrl || "");
  const [tags, setTags] = useState(editContent?.tags || []);

  const handleSave = () => {
    console.log({
      title,
      category,
      description,
      content,
      status,
      publishDate,
      endDate,
      mediaUrl,
      tags,
    });
    onOpenChange(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
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
            <button
              onClick={() => onOpenChange(false)}
              className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Content Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title for your content..."
                  className="rounded-2xl border-gray-200 h-12 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blog" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Blog Article
                      </SelectItem>
                      <SelectItem value="Quote" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Motivational Quote
                      </SelectItem>
                      <SelectItem value="Campaign" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Campaign
                      </SelectItem>
                      <SelectItem value="Video" className="flex items-center gap-2">
                        <Video className="w-4 h-4" /> Video Content
                      </SelectItem>
                      <SelectItem value="Podcast" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Podcast
                      </SelectItem>
                      <SelectItem value="Image" className="flex items-center gap-2">
                        <Image className="w-4 h-4" /> Image-Based Learning
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-[#1C3B5E]">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-12 rounded-2xl border-gray-200">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft" className="text-orange-600">Draft</SelectItem>
                      <SelectItem value="Pending" className="text-blue-600">Pending Review</SelectItem>
                      <SelectItem value="Live" className="text-green-600">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Media Upload
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#20B2AA] transition-colors">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, MP4, PDF up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Media URL */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#1C3B5E]">Media URL (Optional)</Label>
                <Input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg or YouTube URL"
                  className="rounded-2xl border-gray-200 h-12"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#1C3B5E]">Short Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description or summary that will appear in content listings..."
                  className="rounded-2xl border-gray-200 min-h-24 resize-none focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-[#1C3B5E] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Publish Date
                  </Label>
                  <Input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="rounded-2xl border-gray-200 h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-[#1C3B5E]">End Date (Campaigns)</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-2xl border-gray-200 h-12"
                  />
                </div>
              </div>

              {/* Preview Card */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50">
                <h4 className="text-sm font-semibold text-[#1C3B5E] mb-2">Preview</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Title: {title || "No title set"}</p>
                  <p>Category: {category || "No category selected"}</p>
                  <p>Status: <span className={`px-2 py-1 rounded-full text-xs ${
                    status === 'Live' ? 'bg-green-100 text-green-800' :
                    status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>{status || 'Draft'}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Content */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[#1C3B5E]">Full Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your full content here... You can use markdown formatting for better presentation."
              className="rounded-2xl border-gray-200 min-h-48 resize-none focus:border-[#20B2AA] focus:ring-[#20B2AA]/20"
            />
          </div>
        </div>

        {/* Footer */}
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
              className="px-8 py-3 rounded-2xl text-white transition-all duration-200 hover:shadow-lg shadow-md"
              style={{ 
                background: "linear-gradient(135deg, #20B2AA 0%, #1C9B94 100%)"
              }}
            >
              {editContent ? "Update Content" : "Publish Content"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}