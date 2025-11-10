import { Dialog, DialogContent } from "../ui/dialog";
import { X, Calendar, Tag } from "lucide-react";
import { Card } from "../ui/card";

interface PreviewContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: any;
}

export function PreviewContentModal({ open, onOpenChange, content }: PreviewContentModalProps) {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1" style={{ color: "#1C3B5E" }}>
              Content Preview
            </h2>
            <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
              How this content appears to users
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" style={{ color: "#333333" }} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-8 overflow-y-auto flex-1" style={{ backgroundColor: "#f8f8f8" }}>
          <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
            {/* Content Header */}
            <div className="p-8 space-y-4">
              {/* Category Badge */}
              <div
                className="inline-block px-4 py-2 rounded-xl text-sm"
                style={{ backgroundColor: "#20B2AA20", color: "#20B2AA" }}
              >
                {content.category}
              </div>

              {/* Title */}
              <h1 className="text-3xl" style={{ color: "#1C3B5E" }}>
                {content.title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center gap-4 text-sm" style={{ color: "#333333", opacity: 0.6 }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{content.publishDate || "Not scheduled"}</span>
                </div>
                {content.endDate && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Ends: {content.endDate}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {content.description && (
                <p className="text-lg" style={{ color: "#333333", opacity: 0.8 }}>
                  {content.description}
                </p>
              )}
            </div>

            {/* Media */}
            {content.mediaUrl && (
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                <p className="text-sm" style={{ color: "#333333", opacity: 0.5 }}>
                  Media Preview: {content.mediaUrl}
                </p>
              </div>
            )}

            {/* Full Content */}
            {content.content && (
              <div className="p-8">
                <div className="prose max-w-none" style={{ color: "#333333" }}>
                  {content.content.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
