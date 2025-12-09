import { useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { Play, Headphones, Quote, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../../images/ImageWithFallback";
import { useRouter } from "next/router";

interface ResumeContentItem {
  id: number;
  title: string;
  content?: string;
  category: string;
  media_url?: string;
  thumbnail_url?: string;
  author?: string;
  duration?: string;
}

export function ResumeContent() {
  const [resumeItems, setResumeItems] = useState<ResumeContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResumeContent = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No access token found');
          setLoading(false);
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        // console.log('Fetching learning progress from:', `${API_URL}/learning-progress`);

        const response = await fetch(`${API_URL}/learning-progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          // console.error('Error response:', {
          //   status: response.status,
          //   statusText: response.statusText,
          //   errorData
          // });
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('Received data:', data);
        setResumeItems(data.items || []);
      } catch (error) {
        console.error('Error fetching learning progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeContent();
  }, []);

  const handleContentClick = (item: ResumeContentItem) => {
    // Navigate to LearningHub with the specific content using router
    router.push('/app/learning?contentId=' + item.id + '&category=' + item.category);
  };

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'video':
        return Play;
      case 'podcast':
        return Headphones;
      case 'quote':
        return Quote;
      default:
        return Play;
    }
  };

  const getThumbnailUrl = (item: ResumeContentItem) => {
  const category = item.category?.toLowerCase();

  // ❌ Backend is sending wrong thumbnail_url when it's a YouTube link
  // So ONLY use thumbnail_url if it's actually an image file
  if (item.thumbnail_url && /\.(jpg|jpeg|png|webp)$/i.test(item.thumbnail_url)) {
    return item.thumbnail_url;
  }

  // YouTube video ID extraction (supports youtu.be, shorts, normal links)
  const extractYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|shorts\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (item.media_url) {
    const videoId = extractYouTubeId(item.media_url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  // fallback
  return "https://via.placeholder.com/400x225?text=No+Thumbnail";
};




  // Don't render component if loading or no items
  if (loading || resumeItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-gray-900 md:block hidden">
          Continue Your Journey
        </h3>
        {/* <button 
          className="text-sm flex items-center gap-1 text-[#20B2AA] hover:text-[#1a9c94] transition-colors"
          onClick={() => window.location.href = '/app/learning-hub'}
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {resumeItems.map((item, index) => {
          const Icon = getIconForCategory(item.category);
          const isQuote = item.category.toLowerCase() === 'quote';
          // console.log("ITEM:", item);


          return (
            <Card
              key={item.id}
              className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group h-full flex flex-col"
              onClick={() => handleContentClick(item)}
            >
              {/* Thumbnail with Aspect Ratio */}
              <div className="relative pt-[56.25%] overflow-hidden bg-gray-50">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={getThumbnailUrl(item)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={225}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />

                  {/* Overlay with Icon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                    <div className="p-2 rounded-xl bg-[#20B2AA] shadow-md">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                {isQuote ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Quote className="w-4 h-4 flex-shrink-0 mt-1 text-[#20B2AA]" />
                      <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
                        "{item.content}"
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      - {item.author || 'Community Member'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                      {item.title}
                    </h4>
                    {/* <div className="flex items-center justify-between mt-1"> */}
                    {/* <p className="text-xs text-gray-500 truncate pr-2">
                        {item.author || 'Unknown'}
                      </p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {item.duration || '--:--'}
                      </span> */}
                    {/* </div> */}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
