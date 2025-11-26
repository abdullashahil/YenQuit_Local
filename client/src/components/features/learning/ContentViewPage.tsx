import { VideoCard } from "./VideoCard";
import { PodcastCard } from "./PodcastCard";
import { ImageCard } from "./ImageCard";
import { ArrowLeft } from "lucide-react";
import { RecommendedSidebar } from "./RecommendedSidebar";
import { PublicContentItem } from "../../../services/contentService";

interface ContentViewPageProps {
  contentType: "video" | "podcast" | "image";
  items: PublicContentItem[];
  onBack: () => void;
}

export function ContentViewPage({ contentType, items, onBack }: ContentViewPageProps) {
  const getTitle = () => {
    switch (contentType) {
      case "video":
        return "Video-Based Learning";
      case "podcast":
        return "Podcast-Based Learning";
      case "image":
        return "Image-Based Learning";
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
      default:
        return "Browse all available content";
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Main Content Area */}
      <div className="py-4 md:py-6">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 md:mb-6 px-3 py-2 rounded-xl transition-all hover:bg-white"
            style={{ color: "#1C3B5E" }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Learning Hub</span>
          </button>

          {/* Page Header */}
          <div className="mb-6 md:mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: "#1C3B5E" }}>
              {getTitle()}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm md:text-base" style={{ color: "#666" }}>
                {getDescription()}
              </p>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#20B2AA15" }}>
                <span className="text-sm font-semibold" style={{ color: "#20B2AA" }}>
                  {items.length} {contentType === "video" ? "Videos" : contentType === "podcast" ? "Podcasts" : "Images"}
                </span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
            {contentType === "video" &&
              items.map((item, index) => (
                <div key={index} className="transition-transform hover:scale-[1.02] duration-200 [&>*]:!w-full [&>*]:!flex-shrink">
                  <VideoCard 
                    thumbnail={item.media_url || ""}
                    title={item.title}
                    description={item.description || ""}
                    duration={""}
                  />
                </div>
              ))}

            {contentType === "podcast" &&
              items.map((item, index) => (
                <div key={index} className="transition-transform hover:scale-[1.02] duration-200 [&>*]:!w-full [&>*]:!flex-shrink">
                  <PodcastCard 
                    artwork={item.media_url || ""}
                    title={item.title}
                    description={item.description || ""}
                    duration={""}
                  />
                </div>
              ))}

            {contentType === "image" &&
              items.map((item, index) => (
                <div key={index} className="transition-transform hover:scale-[1.02] duration-200 [&>*]:!w-full [&>*]:!flex-shrink">
                  <ImageCard 
                    image={item.media_url || ""}
                    caption={item.title}
                    category={item.description || ""}
                  />
                </div>
              ))}
          </div>

          {/* Empty State */}
          {items.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#20B2AA20" }}>
                  <ArrowLeft className="w-10 h-10" style={{ color: "#20B2AA" }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#1C3B5E" }}>
                  No Content Available
                </h3>
                <p className="text-base mb-6" style={{ color: "#666" }}>
                  There are no {contentType === "video" ? "videos" : contentType === "podcast" ? "podcasts" : "images"} available at the moment. Check back soon!
                </p>
                <button
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: "#20B2AA", color: "white" }}
                >
                  Back to Learning Hub
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Recommended Sidebar */}
      <RecommendedSidebar />
    </div>
  );
}
