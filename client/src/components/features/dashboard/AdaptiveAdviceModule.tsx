import { useState, useEffect } from 'react';
import { Card } from "../../ui/card";
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import quitTrackerService from "../../../services/quitTrackerService";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TEST_USER_ID = "d5799f0c-f707-415e-b9ea-68816351912c";
const CACHE_KEY = 'yenquit_ai_insights';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

interface Insight {
  id: number;
  title: string;
  message: string;
  time?: string;
}

export function AdaptiveAdviceModule() {
  const [showAll, setShowAll] = useState(false);
  const [advice, setAdvice] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);

  // Helper functions for localStorage caching
  const getCachedInsights = (): Insight[] | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid (within 6 hours)
      if (now - timestamp < CACHE_DURATION) {
        setLastRefresh(timestamp);
        return data;
      }
      
      // Cache expired, remove it
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      console.error('Error reading cached insights:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const setCachedInsights = (insights: Insight[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = {
        data: insights,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Error caching insights:', error);
    }
  };

  const clearCache = (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(CACHE_KEY);
    setLastRefresh(null);
  };

  const generateAIInsights = async (progressData: any, logs: any[]): Promise<Insight[]> => {
    try {
      // Prepare user context for AI
      const userContext = {
        daysSmokeFree: progressData.daysSmokeFree || 0,
        successRate: progressData.successRate || 0,
        quitDate: progressData.quitDate,
        totalLogs: logs.length,
        recentLogs: logs.slice(-7), // Last 7 days
        hasRecentSmoking: logs.some(log => log.smoked && new Date(log.log_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        avgCravings: logs.filter(log => log.cravings_level !== null).slice(-7).reduce((sum, log, _, arr) => sum + log.cravings_level / arr.length, 0),
        avgMood: logs.filter(log => log.mood !== null).slice(-7).reduce((sum, log, _, arr) => sum + log.mood / arr.length, 0),
        lastEntry: progressData.lastEntry
      };

      const prompt = `You are an AI behavioral support assistant inside a tobacco-cessation program. Generate short, personalized insights for the user's dashboard based on their log data.

USER CONTEXT:
- Days smoke-free: ${userContext.daysSmokeFree}
- Success rate: ${userContext.successRate}%
- Total logs: ${userContext.totalLogs}
- Recent smoking incidents: ${userContext.hasRecentSmoking ? 'Yes' : 'No'}
- Average cravings (last 7 days): ${userContext.avgCravings.toFixed(1)}/10
- Average mood (last 7 days): ${userContext.avgMood.toFixed(1)}/10
- Last entry: ${userContext.lastEntry || 'No entries yet'}

OUTPUT RULES:
- Produce exactly 3 insights.
- Each insight must be 1-2 sentences max.
- Tone: supportive, realistic, human-like, emotionally-aware.
- Never mention that you are an AI or reference "data analysis."
- Never lecture; keep it friendly, actionable, and encouraging.
- If progress is low or there is relapse, respond with supportive, non-judgmental guidance.
- Avoid repeating the same structure across insights.

Insight Types (in this exact order):
1. Morning Routine Tip — give a small morning habit or mindset tip tailored to the user's state.
2. Trigger Alert — based on craving logs, moods, triggers, or time patterns.
3. Progress Advice — reflect progress since quit date and give one practical next step.

Formatting:
Return a JSON array with 3 objects:
[
  { "title": "Morning Routine Tip", "message": "..." },
  { "title": "Trigger Alert", "message": "..." },
  { "title": "Progress Advice", "message": "..." }
]`;

      const response = await axios.post(`${API_BASE_URL}/yenquit-chat`, {
        message: prompt,
        history: [],
        summary: null,
        skipStorage: true
      });

      // Parse AI response as JSON
      const aiResponse = response.data?.reply || response.data?.message;
let insights;

try {
  // Try to find a JSON array in the response using regex
  const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    insights = JSON.parse(jsonMatch[0]);
  } else {
    throw new Error('No JSON array found in response');
  }
} catch (parseError) {
  console.error('Failed to parse AI response as JSON:', parseError);
  // Fallback to generic insights
  insights = [
    { 
      id: 1,
      title: "Morning Routine Tip", 
      message: "Start your day with a glass of water and deep breathing." 
    },
    { 
      id: 2,
      title: "Trigger Alert", 
      message: "Notice your patterns and prepare for challenging moments." 
    },
    { 
      id: 3,
      title: "Progress Advice", 
      message: "Every day without smoking is a victory worth celebrating." 
    }
  ];
}

return insights.map((insight: any, index: number) => ({
  id: insight.id || index + 1,
  title: insight.title || "Insight",
  message: insight.message || insight
}));

    } catch (error) {
      console.error('Error generating AI insights:', error);
      // Fallback to generic insights
      return [
        { id: 1, title: "Morning Routine Tip", message: "Start your day with a glass of water and deep breathing." },
        { id: 2, title: "Trigger Alert", message: "Notice your patterns and prepare for challenging moments." },
        { id: 3, title: "Progress Advice", message: "Every day without smoking is a victory worth celebrating." }
      ];
    }
  };

  const fetchInsights = async (forceRefresh = false) => {
    try {
      // Check cache first unless force refresh is requested
      if (!forceRefresh) {
        const cachedInsights = getCachedInsights();
        if (cachedInsights) {
          setAdvice(cachedInsights);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      const progressData = await quitTrackerService.getProgress();
      const insights = await generateAIInsights(progressData, progressData.logs || []);
      setAdvice(insights);
      setCachedInsights(insights);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      // Fallback to generic insights
      const fallbackInsights = [
        { id: 1, title: "Morning Routine Tip", message: "Start your day with a glass of water and deep breathing." },
        { id: 2, title: "Trigger Alert", message: "Notice your patterns and prepare for challenging moments." },
        { id: 3, title: "Progress Advice", message: "Every day without smoking is a victory worth celebrating." }
      ];
      setAdvice(fallbackInsights);
      setCachedInsights(fallbackInsights);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    clearCache();
    fetchInsights(true);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const visibleAdvice = showAll ? advice : advice.slice(0, 2);
  const hasMore = advice.length > 2 && !showAll;

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#20B2AA20]">
              <Sparkles className="w-5 h-5 text-[#20B2AA]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            aria-label="Refresh insights"
            title={lastRefresh ? `Last updated: ${new Date(lastRefresh).toLocaleTimeString()}` : 'Refresh insights'}
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Advice Cards */}
            <div className="space-y-3">
              {visibleAdvice.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#20B2AA]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All/Show Less Button */}
            {advice.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-4 py-2.5 text-sm font-medium text-[#20B2AA] hover:text-[#1a9c94] transition-colors"
              >
                {showAll ? 'Show Less' : `View All ${advice.length - 2} More`}
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
