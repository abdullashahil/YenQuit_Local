import { useCallback, useEffect, useState } from "react";
import { VideoCard } from "./VideoCard";
import { PodcastCard } from "./PodcastCard";
import { ImageCard } from "./ImageCard";
import { LearningSection } from "./LearningSection";
import { Button } from "@/components/ui/button";
import { RecommendedSidebar } from "./RecommendedSidebar";
import { ContentViewPage } from "./ContentViewPage";
import contentService, { PublicContentItem } from "../../../services/contentService";
import { X, FileText, Quote } from "lucide-react";

interface LearningHubProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onLogout?: () => void;
}

export function LearningHub({ activeTab, setActiveTab, onLogout }: LearningHubProps) {
  const [currentView, setCurrentView] = useState<"hub" | "content">("hub");
  const [contentType, setContentType] = useState<"video" | "podcast" | "image" | "blog" | "quote">("video");
  // Grouped content state with proper typing
  const [content, setContent] = useState<{
    videos: PublicContentItem[];
    podcasts: PublicContentItem[];
    images: PublicContentItem[];
    blogs: PublicContentItem[];
    quotes: PublicContentItem[];
  }>({
    videos: [],
    podcasts: [],
    images: [],
    blogs: [],
    quotes: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<PublicContentItem | null>(null);
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

  // Fetch all public content
  useEffect(() => {
    let isMounted = true;
    
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentService.getPublicContent();
        
        if (!isMounted) return;
        
        const data = response?.data || response;
        setContent({
          videos: data.videos || [],
          podcasts: data.podcasts || [],
          images: data.images || [],
          blogs: data.blogs || [],
          quotes: data.quotes || []
        });
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error fetching content:', err);
        setError(err?.response?.data?.message || 'Failed to load content. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchContent();
    return () => { isMounted = false; };
  }, []);

  const handleViewMore = (type: "video" | "podcast" | "image" | "blog" | "quote") => {
    setContentType(type);
    setCurrentView("content");
  };

  const handleBackToHub = () => {
    setCurrentView("hub");
  };

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

  const getYoutubeThumbnail = (url: string): string => {
    const videoId = getYoutubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
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

  // closeFullscreenVideo is already defined above

  const handleContentSelect = (content: PublicContentItem) => {
    if ((content.category === 'Video' || content.category === 'Podcast') && content.media_url) {
      handleVideoClick(content);
    } else {
      setSelectedContent(content);
    }
  };

  const getContentItems = (): PublicContentItem[] => {
    switch (contentType) {
      case "video": return content.videos;
      case "podcast": return content.podcasts;
      case "image": return content.images;
      case "blog": return content.blogs;
      case "quote": return content.quotes;
      default: return [];
    }
  };

  const renderMediaContent = (content: PublicContentItem) => {
    if (content.category === 'Video' || content.category === 'Podcast') {
      if (!content.media_url) return null;
      
      const videoId = getYoutubeId(content.media_url);
      if (videoId) {
        return (
          <div className="aspect-video w-full">
            <div
              className="w-full h-full rounded-lg cursor-pointer"
              onClick={() => handleVideoClick(content)}
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-all">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return <div className="text-red-500">Invalid video URL</div>;
    }
    
    if (content.category === 'Blog') {
      return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">{content.title}</h3>
            </div>
            {content.content && (
              <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ 
                __html: content.content.length > 200 
                  ? `${content.content.substring(0, 200)}...` 
                  : content.content 
              }} />
            )}
          </div>
        </div>
      );
    }
    
    if (content.category === 'Quote') {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 h-full">
          <div className="flex flex-col h-full">
            <div className="flex-grow flex items-center">
              <Quote className="w-8 h-8 text-gray-400 mr-3 transform -scale-x-100" />
              <div>
                {content.content && (
                  <p className="text-lg italic text-gray-700">"{content.content}"</p>
                )}
                {content.title && (
                  <p className="mt-2 text-right font-medium text-gray-600">— {content.title}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };


  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            <p className="font-medium">Error loading content</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (currentView === "content") {
    return (
      <ContentViewPage
        contentType={contentType}
        items={getContentItems()}
        onBack={handleBackToHub}
      />
    );
  }

  // Fullscreen Video Modal
  if (fullscreenVideo && fullscreenVideo.id) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Area */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {currentView === "hub" ? (
            <>
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Hub</h1>
            <p className="text-gray-600">Discover educational resources to support your journey</p>
          </div>

              <div className="space-y-16 mb-16">
                {/* Videos Section */}
                {content.videos.length > 0 && (
                  <LearningSection
                    title="Video Tutorials"
                    items={content.videos}
                    type="video"
                    onViewMore={() => handleViewMore("video")}
                    onItemClick={handleContentSelect}
                  />
                )}

                {/* Podcasts Section */}
                {content.podcasts.length > 0 && (
                  <LearningSection
                    title="Podcast Episodes"
                    items={content.podcasts}
                    type="podcast"
                    onViewMore={() => handleViewMore("podcast")}
                    onItemClick={handleContentSelect}
                  />
                )}

                {/* Images Section */}
                {content.images.length > 0 && (
                  <LearningSection
                    title="Visual Learning"
                    items={content.images}
                    type="image"
                    onViewMore={() => handleViewMore("image")}
                    onItemClick={handleContentSelect}
                  />
                )}

                {/* Blogs Section */}
                {content.blogs.length > 0 && (
                  <LearningSection
                    title="Educational Blogs"
                    items={content.blogs}
                    type="blog"
                    onViewMore={() => handleViewMore("blog")}
                    onItemClick={handleContentSelect}
                  />
                )}

                {/* Quotes Section */}
                {/* {content.quotes.length > 0 && (
                  <LearningSection
                    title="Motivational Quotes"
                    items={content.quotes}
                    type="quote"
                    onViewMore={() => handleViewMore("quote")}
                    onItemClick={handleContentSelect}
                  />
                )} */}

                
              </div>
            </>
          ) : (
            <ContentViewPage
              contentType={contentType}
              items={getContentItems()}
              onBack={handleBackToHub}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningHub;
