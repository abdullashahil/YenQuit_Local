import { useEffect, useState } from "react";
import { VideoCard } from "./VideoCard";
import { PodcastCard } from "./PodcastCard";
import { ImageCard } from "./ImageCard";
import { LearningSection } from "./LearningSection";
import { RecommendedSidebar } from "./RecommendedSidebar";
import { ContentViewPage } from "./ContentViewPage";
import contentService, { PublicContentItem } from "../../../services/contentService";

interface LearningHubProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onLogout?: () => void;
}

export function LearningHub({ activeTab, setActiveTab, onLogout }: LearningHubProps) {
  const [currentView, setCurrentView] = useState<"hub" | "content">("hub");
  const [contentType, setContentType] = useState<"video" | "podcast" | "image">("video");
  const [videos, setVideos] = useState<PublicContentItem[]>([]);
  const [podcasts, setPodcasts] = useState<PublicContentItem[]>([]);
  const [images, setImages] = useState<PublicContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const grouped = await contentService.getPublicContent();
        if (!isMounted) return;
        const data = grouped?.data || grouped; // accommodate both shapes
        setVideos(data.videos || []);
        setPodcasts(data.podcasts || []);
        setImages(data.images || []);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load content');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleViewMore = (type: "video" | "podcast" | "image") => {
    setContentType(type);
    setCurrentView("content");
  };

  const handleBackToHub = () => {
    setCurrentView("hub");
  };

  const getContentItems = () => {
    switch (contentType) {
      case "video":
        return videos;
      case "podcast":
        return podcasts;
      case "image":
        return images;
      default:
        return [];
    }
  };

  // Show content view page if user clicked "View More"
  if (currentView === "content") {
    return (
      <ContentViewPage
        contentType={contentType}
        items={getContentItems()}
        onBack={handleBackToHub}
      />
    );
  }

  // Show main hub view
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Main Content Area */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1">
            {/* Main Content */}
            <div className="space-y-6 md:space-y-8 lg:space-y-10">
              {/* Page Header */}
              <div>
                <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
                  Learning Hub
                </h1>
                <p className="text-sm md:text-base" style={{ color: "#333333" }}>
                  Choose your preferred learning style and explore content designed to support your journey
                </p>
              </div>

              {loading && (
                <div className="text-sm" style={{ color: "#333333" }}>Loading content...</div>
              )}
              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              {/* Video-Based Learning Section */}
              <LearningSection 
                title="Video-Based Learning"
                onViewMore={() => handleViewMore("video")}
              >
                {videos.map((item, index) => (
                  <div key={index}>
                    <VideoCard 
                      thumbnail={item.media_url || ""}
                      title={item.title}
                      description={item.description || ""}
                      duration={""}
                    />
                  </div>
                ))}
              </LearningSection>

              {/* Podcast-Based Learning Section */}
              <LearningSection 
                title="Podcast-Based Learning"
                onViewMore={() => handleViewMore("podcast")}
              >
                {podcasts.map((item, index) => (
                  <div key={index}>
                    <PodcastCard 
                      artwork={item.media_url || ""}
                      title={item.title}
                      description={item.description || ""}
                      duration={""}
                    />
                  </div>
                ))}
              </LearningSection>

              {/* Image-Based Learning Section */}
              <LearningSection 
                title="Image-Based Learning"
                onViewMore={() => handleViewMore("image")}
              >
                {images.map((item, index) => (
                  <div key={index}>
                    <ImageCard 
                      image={item.media_url || ""}
                      caption={item.title}
                      category={item.description || ""}
                    />
                  </div>
                ))}
              </LearningSection>
              
              {/* Floating Recommended Sidebar */}
              <RecommendedSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
