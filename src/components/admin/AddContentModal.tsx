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
import { X } from "lucide-react";
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
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1" style={{ color: "#1C3B5E" }}>
              {editContent ? "Edit Content" : "Add New Content"}
            </h2>
            <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
              Create or update content for the Learning Hub and campaigns
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" style={{ color: "#333333" }} />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Title */}
          <div className="space-y-2">
            <Label style={{ color: "#1C3B5E" }}>
              Content Title <span style={{ color: "#D9534F" }}>*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title..."
              className="rounded-2xl border-gray-200 h-12"
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>
                Category <span style={{ color: "#D9534F" }}>*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 rounded-2xl border-gray-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blog">Blog Article</SelectItem>
                  <SelectItem value="Quote">Motivational Quote</SelectItem>
                  <SelectItem value="Campaign">Campaign</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Podcast">Podcast</SelectItem>
                  <SelectItem value="Image">Image-Based Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-12 rounded-2xl border-gray-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending">Pending Review</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label style={{ color: "#1C3B5E" }}>Short Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or summary..."
              className="rounded-2xl border-gray-200 min-h-20 resize-none"
            />
          </div>

          {/* Full Content */}
          <div className="space-y-2">
            <Label style={{ color: "#1C3B5E" }}>Full Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the full content body..."
              className="rounded-2xl border-gray-200 min-h-32 resize-none"
            />
          </div>

          {/* Media URL */}
          <div className="space-y-2">
            <Label style={{ color: "#1C3B5E" }}>Media URL (Optional)</Label>
            <Input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="rounded-2xl border-gray-200 h-12"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>Publish Date</Label>
              <Input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="rounded-2xl border-gray-200 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#1C3B5E" }}>End Date (Campaigns)</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-2xl border-gray-200 h-12"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <Button
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all"
            style={{ color: "#333333" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-8 py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: "#20B2AA" }}
          >
            {editContent ? "Update Content" : "Create Content"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
