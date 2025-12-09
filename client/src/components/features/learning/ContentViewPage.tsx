import { VideoCard } from "./VideoCard";
import { PodcastCard } from "./PodcastCard";
import { ImageCard } from "./ImageCard";
import { LearningSection } from "./LearningSection";
import { ArrowLeft, X } from "lucide-react";
import { RecommendedSidebar } from "./RecommendedSidebar";
import { PublicContentItem } from "../../../services/contentService";
import { useCallback, useEffect, useState } from "react";

interface ContentViewPageProps {
  contentType: "video" | "podcast" | "image" | "blog" | "quote";
  items: PublicContentItem[];
  onBack: () => void;
}

export function ContentViewPage({ contentType, items, onBack }: ContentViewPageProps) {
  const [fullscreenVideo, setFullscreenVideo] = useState<{url: string, title: string, id: string | null, key?: number} | null>(null);

  const closeFullscreenVideo = useCallback(() => {
    setFullscreenVideo(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenVideo) {
        closeFullscreenVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenVideo, closeFullscreenVideo]);

  const getYoutubeId = (url: string): string | null => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch (e) {
      console.error('Error parsing YouTube URL:', e);
      return null;
    }
  };

  const handleVideoClick = (content: PublicContentItem) => {
    if (content.media_url) {
      const videoId = getYoutubeId(content.media_url);
      if (videoId) {
        // Add a timestamp to force iframe remount
        setFullscreenVideo({
          url: content.media_url,
          title: content.title,
          id: videoId,
          key: Date.now() // This will force a remount of the iframe
        });
      }
    }
  };
  const getTitle = () => {
    switch (contentType) {
      case "video":
        return "Video-Based Learning";
      case "podcast":
        return "Podcast Episodes";
      case "image":
        return "Image Gallery";
      case "blog":
        return "Educational Blogs";
      case "quote":
        return "Inspirational Quotes";
      default:
        return "Learning Content";
    }
  };

  const getDescription = () => {
    switch (contentType) {
      case "video":
        return "Explore our complete collection of educational videos to support your journey";
      case "podcast":
        return "Listen to inspiring stories and expert advice from our podcast library";
      case "image":
        return "Browse through motivational images and affirmations";
      case "blog":
        return "Read our latest articles and educational blog posts";
      case "quote":
        return "Find motivation and inspiration from our collection of quotes";
      default:
        return "Browse all available content";
    }
  };

  const handleContentSelect = (content: PublicContentItem) => {
    // Handle video/podcast playback using local video modal
    if ((contentType === "video" || contentType === "podcast")) {
      handleVideoClick(content);
    } else if (contentType === "image") {
      // For images, we could show a modal or just log - the LearningSection already handles image modal
      console.log('Selected image content:', content);
    } else {
      // Handle other content types (can be expanded based on requirements)
      console.log('Selected content:', content);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Area */}
      <div className="p-2 md:p-4 lg:p-6">
        <div className="w-full">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 md:mb-6 px-3 py-2 rounded-xl transition-all hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Learning Hub</span>
          </button>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
            <p className="text-gray-600">{getDescription()}</p>
          </div>

          {/* Content Section */}
          <div className="space-y-16">
            {items.length > 0 && (
              <LearningSection
                title={getTitle()}
                items={items}
                type={contentType}
                onViewMore={undefined}
                onItemClick={handleContentSelect}
              />
            )}
          </div>

          {/* Empty State */}
          {items.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100">
                  <ArrowLeft className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  No Content Available
                </h3>
                <p className="text-base mb-6 text-gray-600">
                  There are no {contentType === "video" ? "videos" : contentType === "podcast" ? "podcasts" : contentType === "image" ? "images" : contentType === "blog" ? "blogs" : "quotes"} available at the moment. Check back soon!
                </p>
                <button
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 bg-blue-500 text-white"
                >
                  Back to Learning Hub
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Recommended Sidebar */}
      {/* <RecommendedSidebar /> */}
      
      {/* Fullscreen Video Modal */}
      {fullscreenVideo && fullscreenVideo.id && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeFullscreenVideo}
        >
          <div 
            className="relative w-full max-w-4xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeFullscreenVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 z-10"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative" style={{ paddingBottom: '56.25%', backgroundColor: '#000' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full" key={fullscreenVideo.key}>
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube-nocookie.com/embed/${fullscreenVideo.id}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
                    title={fullscreenVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    frameBorder="0"
                    loading="eager"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                  <div className="text-center mt-2 text-gray-400 text-sm">
                    If the video doesn't load, try <a 
                      href={`https://www.youtube.com/watch?v=${fullscreenVideo.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      watching on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 px-2">
              <h2 className="text-xl font-semibold text-white">{fullscreenVideo.title}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
