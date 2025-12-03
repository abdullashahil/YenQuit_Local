import { ChevronRight, Play, Headphones, BookOpen, Quote, Image as ImageIcon, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  media_url?: string;
  content?: string;
  category: string;
  publish_date?: string;
  tags?: string[];
}

interface LearningSectionProps {
  title: string;
  items: ContentItem[];
  type: 'video' | 'podcast' | 'blog' | 'quote' | 'image';
  onViewMore?: () => void;
  onItemClick?: (item: ContentItem) => void;
  children?: ReactNode;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Play className="w-4 h-4" />;
    case 'podcast':
      return <Headphones className="w-4 h-4" />;
    case 'blog':
      return <BookOpen className="w-4 h-4" />;
    case 'quote':
      return <Quote className="w-4 h-4" />;
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    default:
      return null;
  }
};

// Custom Blog Card component with modal functionality
const BlogCard = ({ item, onItemClick }: { item: ContentItem; onItemClick?: (item: ContentItem) => void }) => {
  const handleCardClick = () => {
    // For blog items, we'll handle the modal in the parent component
    onItemClick?.(item);
  };

  const getFirstLine = (text?: string) => {
    if (!text) return '';
    const lines = text.split(/\r\n|\r|\n/);
    return lines[0] + (lines.length > 1 ? '...' : '');
  };

  return (
    <Card 
      className="w-64 flex-shrink-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200"
      onClick={handleCardClick}
    >
      <div className="relative">
        {item.media_url && (
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <img
              src={item.media_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-4 bg-white">
          <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {getFirstLine(item.content || item.description)}
          </p>
        </CardContent>
      </div>
    </Card>
  );
};

export function LearningSection({ 
  title, 
  items = [], 
  type, 
  onViewMore, 
  onItemClick,
  children 
}: LearningSectionProps) {
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<ContentItem | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ContentItem | null>(null);
  
  if (items.length === 0 && !children) return null;

  const renderContent = () => {
    if (children) return children;

    return items.slice(0, 4).map((item) => {
      if (type === 'blog') {
        return <BlogCard key={item.id} item={item} onItemClick={handleBlogClick} />;
      }

      return (
        <Card 
          key={item.id} 
          className="w-64 flex-shrink-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => type === 'image' ? handleImageClick(item) : onItemClick?.(item)}
        >
          <div className="relative">
            {item.media_url && type !== 'quote' && (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {type === 'video' || type === 'podcast' ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`https://img.youtube.com/vi/${getYoutubeId(item.media_url)}/hqdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                        {getIcon(type)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </CardContent>
          </div>
        </Card>
      );
    });
  };

  const handleBlogClick = (item: ContentItem) => {
    setSelectedBlog(item);
    setShowBlogModal(true);
  };

  const handleImageClick = (item: ContentItem) => {
    setSelectedImage(item);
    setShowImageModal(true);
  };

  // Extract YouTube video ID from URL
  function getYoutubeId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
        </h2>
        {onViewMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewMore}
            className="text-green-700 hover:bg-blue-50 flex items-center gap-1.5"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="relative">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.1)_transparent] hover:[scrollbar-color:rgba(0,0,0,0.15)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 hover:[&::-webkit-scrollbar-thumb]:bg-black/15 [&::-webkit-scrollbar-button]:hidden">
          <div className="flex gap-4 pb-2">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Blog Modal */}
      {type === 'blog' && (
        <Dialog open={showBlogModal} onOpenChange={setShowBlogModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
            {selectedBlog && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedBlog.title}
                  </h2>
                  {selectedBlog.publish_date && (
                    <p className="text-sm text-gray-500">
                      {new Date(selectedBlog.publish_date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {selectedBlog.media_url && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedBlog.media_url}
                      alt={selectedBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {selectedBlog.description && (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 italic border-l-4 border-blue-500 pl-4">
                      {selectedBlog.description}
                    </p>
                  </div>
                )}

                {selectedBlog.content && (
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {selectedBlog.content}
                    </div>
                  </div>
                )}

                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {selectedBlog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Image Modal */}
      {type === 'image' && (
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden bg-white p-0">
            {selectedImage && (
              <div className="relative w-full h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center bg-black">
                  <img
                    src={selectedImage.media_url}
                    alt={selectedImage.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                {selectedImage.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      {selectedImage.title}
                    </h3>
                    {selectedImage.description && (
                      <p className="text-white/80 text-sm">
                        {selectedImage.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
