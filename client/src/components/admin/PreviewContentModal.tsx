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
      <DialogContent className=" p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
        
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
            {content.media_url && (
              <div className="w-full">
                {content.category === 'Image' ? (
                  <img 
                    src={content.media_url} 
                    alt={content.title || "Content image"}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                ) : content.category === 'Video' || content.category === 'Podcast' ? (
                  <div className="w-full p-8 bg-gray-50">
                    <div className="text-center space-y-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {content.category === 'Video' ? 'Video URL:' : 'Podcast URL:'}
                      </p>
                      <a 
                        href={content.media_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all text-lg"
                      >
                        {content.media_url}
                      </a>
                      <p className="text-xs text-gray-500">
                        Click to open in YouTube
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                    <p className="text-sm" style={{ color: "#333333", opacity: 0.5 }}>
                      Media Preview: {content.media_url}
                    </p>
                  </div>
                )}
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
