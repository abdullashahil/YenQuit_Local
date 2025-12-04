import { VideoCard } from "./VideoCard";
import { PodcastCard } from "./PodcastCard";
import { ImageCard } from "./ImageCard";
import { LearningSection } from "./LearningSection";
import { ArrowLeft } from "lucide-react";
import { RecommendedSidebar } from "./RecommendedSidebar";
import { PublicContentItem } from "../../../services/contentService";

interface ContentViewPageProps {
  contentType: "video" | "podcast" | "image" | "blog" | "quote";
  items: PublicContentItem[];
  onBack: () => void;
}

export function ContentViewPage({ contentType, items, onBack }: ContentViewPageProps) {
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
    // Handle content selection - can be expanded based on requirements
    console.log('Selected content:', content);
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
      <RecommendedSidebar />
    </div>
  );
}
