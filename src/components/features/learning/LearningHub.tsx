import { Sidebar } from "../../layouts/Sidebar";
import { VideoCard } from "./VideoCard";
import { PodcastCard } from "./PodcastCard";
import { ImageCard } from "./ImageCard";
import { LearningSection } from "./LearningSection";
import { RecommendedSidebar } from "./RecommendedSidebar";

interface LearningHubProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export function LearningHub({ activeTab, setActiveTab, onLogout }: LearningHubProps) {
  const videos = [
    {
      thumbnail: "https://images.unsplash.com/photo-1716284129276-c84a6b77325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwYnJlYXRoaW5nJTIwcmVsYXhhdGlvbnxlbnwxfHx8fDE3NjA3MDY5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "5-Minute Breathing Exercises for Cravings",
      description: "Learn simple yet powerful breathing techniques to manage cravings whenever they arise.",
      duration: "5:32",
      instructor: "Dr. Sarah Mitchell",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1678356717973-f2177782388a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbHVuZ3MlMjBleGVyY2lzZXxlbnwxfHx8fDE3NjA3MDY5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Understanding Your Lung Recovery",
      description: "Discover how your lungs heal over time and the amazing benefits of staying smoke-free.",
      duration: "12:18",
      instructor: "Dr. James Chen",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1594830877931-28a20abe4bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwb3J0JTIwZ3JvdXAlMjB0aGVyYXB5fGVufDF8fHx8MTc2MDcwNjk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Building Your Support System",
      description: "How to communicate with family and friends about your journey to better support.",
      duration: "8:45",
      instructor: "Lisa Thompson",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1549925245-8a7a48495212?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMHNjaWVuY2UlMjBuZXVyb25zfGVufDF8fHx8MTc2MDcwNjk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "The Science of Nicotine Addiction",
      description: "Understanding how nicotine affects your brain and why quitting is challenging.",
      duration: "15:22",
      instructor: "Dr. Michael Roberts",
    },
  ];

  const podcasts = [
    {
      artwork: "https://images.unsplash.com/photo-1657121576206-853809d5310e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMGF1ZGlvfGVufDF8fHx8MTc2MDYyOTY5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Real Stories: One Year Smoke-Free",
      description: "Hear from people who have successfully quit for over a year and their advice for staying strong.",
      duration: "32:15",
      episode: "Episode 12",
    },
    {
      artwork: "https://images.unsplash.com/photo-1696694139028-3ad9a50a42ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RpdmF0aW9uJTIwc3VjY2VzcyUyMGpvdXJuZXl8ZW58MXx8fHwxNzYwNzA2OTk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Navigating Social Situations",
      description: "Expert tips on handling parties, bars, and other triggering environments without tobacco.",
      duration: "28:40",
      episode: "Episode 8",
    },
    {
      artwork: "https://images.unsplash.com/photo-1527633961552-6c798340c261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMHplbiUyMHBlYWNlfGVufDF8fHx8MTc2MDcwNjk5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Mindfulness for Quitting Success",
      description: "Learn how mindfulness meditation can help you stay present and resist cravings.",
      duration: "25:18",
      episode: "Episode 15",
    },
    {
      artwork: "https://images.unsplash.com/photo-1589451431369-f569890dfd84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlbmd0aCUyMGRldGVybWluYXRpb24lMjBmaXRuZXNzfGVufDF8fHx8MTc2MDcwNjk5NXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Physical Exercise as Your Ally",
      description: "How regular exercise can dramatically improve your quit journey and reduce withdrawal symptoms.",
      duration: "30:05",
      episode: "Episode 6",
    },
  ];

  const images = [
    {
      image: "https://images.unsplash.com/photo-1759876702958-933bb29c1acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMGZyZWVkb20lMjBuYXR1cmV8ZW58MXx8fHwxNzYwNzA2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Every breath you take is a victory. Celebrate your freedom.",
      category: "Motivation",
    },
    {
      image: "https://images.unsplash.com/photo-1567535011323-743c98f5e331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGFpciUyMG1vdW50YWluc3xlbnwxfHx8fDE3NjA3MDY5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "You are stronger than your cravings. Keep climbing.",
      category: "Strength",
    },
    {
      image: "https://images.unsplash.com/photo-1678356717973-f2177782388a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbHVuZ3MlMjBleGVyY2lzZXxlbnwxfHx8fDE3NjA3MDY5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Your body is healing. Your lungs are thanking you.",
      category: "Health",
    },
    {
      image: "https://images.unsplash.com/photo-1716284129276-c84a6b77325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwYnJlYXRoaW5nJTIwcmVsYXhhdGlvbnxlbnwxfHx8fDE3NjA3MDY5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Peace comes from within. Find your calm, stay smoke-free.",
      category: "Wellness",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-9 space-y-6 md:space-y-8 lg:space-y-10">
              {/* Page Header */}
              <div>
                <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
                  Learning Hub
                </h1>
                <p className="text-sm md:text-base" style={{ color: "#333333" }}>
                  Choose your preferred learning style and explore content designed to support your journey
                </p>
              </div>

              {/* Video-Based Learning Section */}
              <LearningSection title="Video-Based Learning">
                {videos.map((video, index) => (
                  <div key={index}>
                    <VideoCard {...video} />
                  </div>
                ))}
              </LearningSection>

              {/* Podcast-Based Learning Section */}
              <LearningSection title="Podcast-Based Learning">
                {podcasts.map((podcast, index) => (
                  <div key={index}>
                    <PodcastCard {...podcast} />
                  </div>
                ))}
              </LearningSection>

              {/* Image-Based Learning Section */}
              <LearningSection title="Image-Based Learning">
                {images.map((image, index) => (
                  <div key={index}>
                    <ImageCard {...image} />
                  </div>
                ))}
              </LearningSection>
            </div>

            {/* Right Sidebar - Recommendations */}
            <div className="lg:col-span-3">
              <RecommendedSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
