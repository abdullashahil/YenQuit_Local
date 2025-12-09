import { Card } from "../../ui/card";
import { Heart, Flame, Award, IndianRupee, Badge, GraduationCap } from "lucide-react";
import { useState, useEffect } from 'react';
import { SavingsCalculator } from './SavingsCalculator';
import userService from "../../../services/userService";
import quitTrackerService from "../../../services/quitTrackerService";
import learningProgressService from "../../../services/learningProgressService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";

export function StatsSnapshot() {
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [calculatedSavings, setCalculatedSavings] = useState(212); // Default fallback
  const [isLoadingSavings, setIsLoadingSavings] = useState(true);
  const [healthScore, setHealthScore] = useState(97);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  const [showHealthDetails, setShowHealthDetails] = useState(false);
  const [showMilestoneDetails, setShowMilestoneDetails] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [isLoadingMilestones, setIsLoadingMilestones] = useState(true);
  const [learningProgressCount, setLearningProgressCount] = useState(0);
  const [isLoadingLearningProgress, setIsLoadingLearningProgress] = useState(true);

  // Fetch calculated savings
  useEffect(() => {
    const fetchSavings = async () => {
      try {
        setIsLoadingSavings(true);
        
        // Fetch user answers to get smoking count and price
        const answersResponse = await userService.getUserAnswers();
        if (answersResponse.success && answersResponse.data) {
          let smokingCount = 0;
          let cigarettePrice = 17; // Default fallback
          
          // Get smoking count from question_id 10
          const smokingAnswer = answersResponse.data.find((answer: any) => answer.question_id === 10);
          if (smokingAnswer && smokingAnswer.answer_text) {
            const smokingText = smokingAnswer.answer_text;
            
            if (smokingText.includes('Less than 5')) {
              smokingCount = 5;
            } else if (smokingText.includes('5-10')) {
              smokingCount = 10;
            } else if (smokingText.includes('11-20')) {
              smokingCount = 20;
            } else if (smokingText.includes('More than 20')) {
              smokingCount = 25;
            }
          }
          
          // Get price per cigarette from question_id 11
          const priceAnswer = answersResponse.data.find((answer: any) => answer.question_id === 11);
          if (priceAnswer && priceAnswer.answer_text) {
            const priceText = priceAnswer.answer_text;
            
            if (priceText.includes('₹')) {
              const match = priceText.match(/₹(\d+)/g);
              if (match && match.length > 0) {
                const prices = match.map(p => parseInt(p.replace('₹', '')));
                cigarettePrice = Math.max(...prices);
              }
            }
          }
          
          // Fetch daily logs to calculate total cigarettes smoked
          const logsResponse = await quitTrackerService.getLogs();
          if (logsResponse.logs) {
            const logs = logsResponse.logs;
            
            // Sum up all cigarettes smoked from logs
            const totalSmoked = logs.reduce((sum: number, log: any) => {
              return sum + (log.cigarettes_count || 0);
            }, 0);
            
            // Calculate savings using the real formula
            const savings = (logs.length * smokingCount - totalSmoked) * cigarettePrice;
            setCalculatedSavings(savings);
          }
        } else {
          // No user answers data found
        }
      } catch (error) {
        // Error fetching savings data
      } finally {
        setIsLoadingSavings(false);
      }
    };

    fetchSavings();
  }, []);

  // Fetch learning progress count
  useEffect(() => {
    const fetchLearningProgress = async () => {
      try {
        setIsLoadingLearningProgress(true);
        const progressResponse = await learningProgressService.getProgressCount();
        setLearningProgressCount(progressResponse.count);
      } catch (error) {
        console.error('Error fetching learning progress count:', error);
        setLearningProgressCount(0);
      } finally {
        setIsLoadingLearningProgress(false);
      }
    };

    fetchLearningProgress();
  }, []);

  // Calculate milestones based on user progress
  useEffect(() => {
    const calculateMilestones = async () => {
      // Only calculate if health score and learning progress are not loading
      if (isLoadingHealth || isLoadingLearningProgress) return;
      
      try {
        const logsResponse = await quitTrackerService.getLogs();
        const answersResponse = await userService.getUserAnswers();
        
        let userMilestones = [];
        let totalAchieved = 0;
        
        if (logsResponse.logs && answersResponse.success) {
          const logs = logsResponse.logs;
          const smokeFreeDays = logs.filter((log: any) => !log.smoked).length;
          const totalDays = logs.length;
          const smokeFreeRate = totalDays > 0 ? (smokeFreeDays / totalDays) * 100 : 0;
          
          // Calculate streak (consecutive smoke-free days)
          let currentStreak = 0;
          let maxStreak = 0;
          
          for (let i = logs.length - 1; i >= 0; i--) {
            if (!logs[i].smoked) {
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else {
              currentStreak = 0;
            }
          }
          
          // Use the already calculated health score from the state
          // This ensures consistency with the health score modal
          const milestoneHealthScore = healthScore;
          
          // Milestone definitions
          const milestoneDefinitions = [
            {
              id: 'first_day',
              title: 'First Step',
              description: 'Started your quit journey',
              icon: '🚀',
              category: 'journey',
              achieved: totalDays >= 1,
              date: logs.length > 0 ? logs[logs.length - 1].log_date : null,
              color: '#4CAF50',
              points: 10
            },
            {
              id: 'three_days',
              title: '3-Day Warrior',
              description: '3 days smoke-free',
              icon: '⚔️',
              category: 'consistency',
              achieved: maxStreak >= 3,
              date: logs.find((log: any, index: number) => {
                let streak = 0;
                for (let i = index; i < logs.length; i++) {
                  if (!logs[i].smoked) streak++;
                  else break;
                }
                return streak >= 3;
              })?.log_date || null,
              color: '#2196F3',
              points: 25
            },
            {
              id: 'one_week',
              title: 'Week Champion',
              description: '7 days smoke-free',
              icon: '🏆',
              category: 'consistency',
              achieved: maxStreak >= 7,
              date: logs.find((log: any, index: number) => {
                let streak = 0;
                for (let i = index; i < logs.length; i++) {
                  if (!logs[i].smoked) streak++;
                  else break;
                }
                return streak >= 7;
              })?.log_date || null,
              color: '#FF9800',
              points: 50
            },
            {
              id: 'health_improver',
              title: 'Health Improver',
              description: 'Health score above 70%',
              icon: '❤️',
              category: 'health',
              achieved: milestoneHealthScore >= 70,
              date: milestoneHealthScore >= 70 ? new Date().toISOString().split('T')[0] : null,
              color: '#E91E63',
              points: 30
            },
            {
              id: 'money_saver',
              title: 'Money Saver',
              description: 'Saved over ₹1000',
              icon: '💰',
              category: 'financial',
              achieved: calculatedSavings > 1000,
              date: calculatedSavings > 1000 ? new Date().toISOString().split('T')[0] : null,
              color: '#9C27B0',
              points: 40
            },
            {
              id: 'cravings_master',
              title: 'Cravings Master',
              description: 'Average cravings below 3',
              icon: '🧘',
              category: 'control',
              achieved: logs.length > 0 && (logs.reduce((sum: number, log: any) => sum + (log.cravings_level || 5), 0) / logs.length) < 3,
              date: logs.length > 0 && (logs.reduce((sum: number, log: any) => sum + (log.cravings_level || 5), 0) / logs.length) < 3 ? new Date().toISOString().split('T')[0] : null,
              color: '#00BCD4',
              points: 35
            },
            {
              id: 'learning_enthusiast',
              title: 'Learning Enthusiast',
              description: 'Completed at least 12 learning contents',
              icon: '📚',
              category: 'education',
              achieved: learningProgressCount >= 12,
              date: learningProgressCount >= 12 ? new Date().toISOString().split('T')[0] : null,
              color: '#795548',
              points: 20,
              link: '/app/learning'
            },
            {
              id: 'mood_booster',
              title: 'Mood Booster',
              description: 'Average mood above 7',
              icon: '😊',
              category: 'wellness',
              achieved: logs.length > 0 && (logs.reduce((sum: number, log: any) => sum + (log.mood || 5), 0) / logs.length) > 7,
              date: logs.length > 0 && (logs.reduce((sum: number, log: any) => sum + (log.mood || 5), 0) / logs.length) > 7 ? new Date().toISOString().split('T')[0] : null,
              color: '#FFEB3B',
              points: 25
            }
          ];
          
          userMilestones = milestoneDefinitions.map(milestone => ({
            ...milestone,
            achieved: milestone.achieved,
            progress: milestone.achieved
              ? 100
              : calculateProgress(
                  milestone.id,
                  logs,
                  smokeFreeRate,
                  maxStreak,
                  milestoneHealthScore,
                  calculatedSavings,
                  learningProgressCount
                )
          }));
          
          totalAchieved = userMilestones.filter(m => m.achieved).length;
        }
        
        setMilestones(userMilestones);
      } catch (error) {
        console.error('Error calculating milestones:', error);
      } finally {
        setIsLoadingMilestones(false);
      }
    };

    const calculateProgress = (
      milestoneId: string,
      logs: any[],
      smokeFreeRate: number,
      maxStreak: number,
      healthScore: number,
      savings: number,
      learningCount: number
    ) => {
      switch (milestoneId) {
        case 'three_days':
          return Math.min(100, (maxStreak / 3) * 100);
        case 'one_week':
          return Math.min(100, (maxStreak / 7) * 100);
        case 'health_improver':
          return healthScore; // Just use the same health score percentage
        case 'money_saver':
          return Math.min(100, (Math.max(0, savings) / 1000) * 100);
        case 'cravings_master':
          const avgCravings = logs.length > 0 ? logs.reduce((sum: number, log: any) => sum + (log.cravings_level || 5), 0) / logs.length : 5;
          return Math.max(0, Math.min(100, ((5 - avgCravings) / 2) * 100));
        case 'mood_booster':
          const avgMood = logs.length > 0 ? logs.reduce((sum: number, log: any) => sum + (log.mood || 5), 0) / logs.length : 5;
          return Math.min(100, (avgMood / 7) * 100);
        case 'learning_enthusiast':
          return Math.min(100, (learningCount / 12) * 100);
        default:
          return 0;
      }
    };

    calculateMilestones();
  }, [!isLoadingHealth, !isLoadingLearningProgress, healthScore, calculatedSavings, learningProgressCount]);

  // Calculate health score based on user data
  useEffect(() => {
    const calculateHealthScore = async () => {
      try {
        const logsResponse = await quitTrackerService.getLogs();
        if (logsResponse.logs && logsResponse.logs.length > 0) {
          const logs = logsResponse.logs;
          let score = 100; // Start with perfect score
          
          // Calculate smoke-free days percentage
          const smokeFreeDays = logs.filter((log: any) => !log.smoked).length;
          const smokeFreePercentage = (smokeFreeDays / logs.length) * 100;
          
          // Calculate average cravings and mood
          const avgCravings = logs.reduce((sum: number, log: any) => sum + (log.cravings_level || 5), 0) / logs.length;
          const avgMood = logs.reduce((sum: number, log: any) => sum + (log.mood || 5), 0) / logs.length;
          
          // Deduct points based on smoking
          score -= (100 - smokeFreePercentage) * 0.4; // 40% weight for smoke-free days
          
          // Deduct points for high cravings (lower cravings = better)
          if (avgCravings > 7) {
            score -= 15;
          } else if (avgCravings > 5) {
            score -= 8;
          }
          
          // Deduct points for poor mood (higher mood = better)
          if (avgMood < 3) {
            score -= 15;
          } else if (avgMood < 5) {
            score -= 8;
          }
          
          // Bonus points for consistency
          if (logs.length >= 7) {
            score += 5; // Consistency bonus
          }
          
          // Ensure score stays within 0-100 range
          score = Math.max(0, Math.min(100, Math.round(score)));
          setHealthScore(score);
        }
      } catch (error) {
        console.error('Error calculating health score:', error);
      } finally {
        setIsLoadingHealth(false);
      }
    };

    calculateHealthScore();
  }, []);

  // Check if savings is negative (user smoked more than previous habit)
  const isNegativeSavings = calculatedSavings < 0;
  const displaySavings = calculatedSavings; // Keep the negative sign

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "#20B2AA"; // Teal - Excellent
    if (score >= 60) return "#8BC34A"; // Green - Good
    if (score >= 40) return "#FFA500"; // Orange - Fair
    return "#D9534F"; // Red - Poor
  };

  const getHealthScoreMessage = (score: number) => {
    if (score >= 80) {
      return {
        title: "Excellent Health Score!",
        message: "Your health score is outstanding! You're making remarkable progress in your quit journey.",
        benefits: [
          "Reduced risk of heart disease and stroke",
          "Improved lung function and breathing",
          "Better circulation and oxygen levels",
          "Enhanced immune system function",
          "Increased energy and vitality",
          "Lower cancer risk over time"
        ],
        recommendations: "Keep up the excellent work! Continue your current strategies and consider sharing your success story to motivate others."
      };
    } else if (score >= 60) {
      return {
        title: "Good Health Score!",
        message: "You're doing well in your quit journey with positive health improvements.",
        benefits: [
          "Significant reduction in smoking-related health risks",
          "Improved breathing and lung capacity",
          "Better cardiovascular health",
          "Enhanced sense of taste and smell",
          "More energy and better sleep quality"
        ],
        recommendations: "Continue your current progress. Consider setting new goals and maintaining your quit strategies."
      };
    } else if (score >= 40) {
      return {
        title: "Fair Health Score",
        message: "You're making progress but there's room for improvement in your quit journey.",
        challenges: [
          "Continued exposure to smoking health risks",
          "Slower recovery of lung function",
          "Higher risk of smoking-related illnesses",
          "Potential withdrawal symptoms affecting daily life"
        ],
        recommendations: "Consider seeking additional support, reviewing your quit strategies, and setting more structured goals."
      };
    } else {
      return {
        title: "Health Score Needs Improvement",
        message: "Your current smoking patterns are significantly impacting your health. Immediate action is recommended.",
        severity: [
          "High risk of heart disease and stroke",
          "Significant lung damage and breathing problems",
          "Increased cancer risk",
          "Reduced life expectancy",
          "Poor circulation and cardiovascular health",
          "Weakened immune system"
        ],
        recommendations: "Strongly recommend consulting with a healthcare provider, seeking professional quit support, and considering nicotine replacement therapy."
      };
    }
  };

  const handleNavigation = (path: string) => {
    window.location.href = path.startsWith('/') ? path : `/${path}`;
  };

  const stats = [
    // {
    //   label: "Current Streak",
    //   value: "16",
    //   unit: "days",
    //   icon: Flame,
    //   color: "#20B2AA",
    //   onClick: () => {}
    // },
    {
      label: "Savings Calculator",
      value: isLoadingSavings ? "..." : displaySavings.toLocaleString(),
      unit: "Rs",
      icon: IndianRupee,
      color: isNegativeSavings ? "#D9534F" : "#20B2AA",
      onClick: () => setShowSavingsCalculator(true)
    },
    {
      label: "Health Score",
      value: isLoadingHealth ? "..." : healthScore.toString(),
      unit: "%",
      icon: Heart,
      color: getHealthScoreColor(healthScore),
      onClick: () => setShowHealthDetails(true)
    },
    {
      label: "Milestones",
      value: isLoadingMilestones ? "..." : milestones.filter(m => m.achieved).length.toString(),
      unit: "achieved",
      icon: Award,
      color: "#20B2AA",
      onClick: () => setShowMilestoneDetails(true)
    },
    {
      label: "5A's Strategy",
      value: "5A",
      unit: "'s",
      icon: Badge,
      color: "#4A90E2",
      onClick: () => handleNavigation('5a/ask')
    },
    {
      label: "5R's Strategy",
      value: "5R",
      unit: "'s",
      icon: GraduationCap,
      color: "#E2A84A",
      onClick: () => handleNavigation('/5r/relevance')
    },
  ];

  // Filter out any undefined stats (commented out)
  const visibleStats = stats.filter(stat => stat);
  
  // Calculate responsive column classes based on number of visible stats
  const getGridCols = (count: number) => {
    if (count <= 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    if (count === 4) return 'grid-cols-2 md:grid-cols-4';
    if (count === 5) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
  };

  return (
    <>
      <div className={`grid ${getGridCols(visibleStats.length)} gap-3 md:gap-4 lg:gap-6`}>
        {visibleStats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card 
              key={index} 
              className={`p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer flex flex-col items-center ${stat.onClick ? 'hover:scale-[1.02]' : ''}`}
              onClick={stat.onClick}
            >
              <div className="mb-3 md:mb-4 flex justify-center w-full">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>

              <div className="space-y-1 text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl md:text-3xl font-medium" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-600">
                    {stat.unit}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <SavingsCalculator 
        isOpen={showSavingsCalculator}
        onClose={() => setShowSavingsCalculator(false)}
      />

      {/* Health Score Details Modal */}
      <Dialog open={showHealthDetails} onOpenChange={setShowHealthDetails}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-800" style={{ color: getHealthScoreColor(healthScore) }}>
              {getHealthScoreMessage(healthScore).title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: getHealthScoreColor(healthScore) }}>
                {healthScore}%
              </div>
              <p className="text-gray-600">
                {getHealthScoreMessage(healthScore).message}
              </p>
            </div>

            {/* Benefits or Challenges based on score */}
            <div className="bg-gray-50 rounded-lg p-4">
              {healthScore >= 60 ? (
                <>
                  <h4 className="font-semibold text-gray-800 mb-2">Health Benefits You're Experiencing:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {getHealthScoreMessage(healthScore).benefits?.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-gray-800 mb-2">Health Challenges:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {getHealthScoreMessage(healthScore).challenges?.map((challenge: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-2">⚠</span>
                        {challenge}
                      </li>
                    ))}
                    {getHealthScoreMessage(healthScore).severity?.map((severity: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">⚠</span>
                        {severity}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
              <p className="text-sm text-gray-600">
                {getHealthScoreMessage(healthScore).recommendations}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">How Your Score is Calculated:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Smoke-free days: 40% weight</p>
                <p>• Cravings level: 20% weight</p>
                <p>• Mood assessment: 20% weight</p>
                <p>• Consistency bonus: +5 points</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowHealthDetails(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Milestone Details Modal */}
      <Dialog open={showMilestoneDetails} onOpenChange={setShowMilestoneDetails}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Your Milestone Journey</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Summary */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {milestones.filter(m => m.achieved).length} / {milestones.length}
              </div>
              <p className="text-gray-600">Milestones Achieved</p>
              <div className="text-sm text-gray-500 mt-2">
                Total Points: {milestones.filter(m => m.achieved).reduce((sum, m) => sum + m.points, 0)}
              </div>
            </div>

            {/* Milestone Categories */}
            <div className="space-y-4">
              {['journey', 'consistency', 'health', 'financial', 'control', 'education', 'wellness'].map(category => {
                const categoryMilestones = milestones.filter(m => m.category === category);
                if (categoryMilestones.length === 0) return null;
                
                const categoryTitles = {
                  journey: '🚀 Journey Milestones',
                  consistency: '⚔️ Consistency Milestones', 
                  health: '❤️ Health Milestones',
                  financial: '💰 Financial Milestones',
                  control: '🧘 Control Milestones',
                  education: '📚 Education Milestones',
                  wellness: '😊 Wellness Milestones'
                };

                return (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{categoryTitles[category]}</h4>
                    <div className="space-y-3">
                      {categoryMilestones.map(milestone => (
                        <div key={milestone.id} className="flex items-center space-x-3">
                          <div className="text-2xl">{milestone.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-800">{milestone.title}</h5>
                                <p className="text-sm text-gray-600">{milestone.description}</p>
                                {milestone.date && (
                                  <p className="text-xs text-gray-500">
                                    {milestone.achieved ? `Achieved: ${new Date(milestone.date).toLocaleDateString()}` : 'Not yet achieved'}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-700">{milestone.points} pts</div>
                                {milestone.achieved ? (
                                  <span className="text-green-500 text-sm">✓</span>
                                ) : (
                                  <div className="text-xs text-gray-500">
                                    {Math.round(milestone.progress)}%
                                  </div>
                                )}
                              </div>
                            </div>
                            {!milestone.achieved && milestone.progress > 0 && (
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${milestone.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            {milestone.link && (
                              <button 
                                onClick={() => handleNavigation(milestone.link)}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                Visit Learning Hub →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Steps */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Next Steps:</h4>
              <div className="text-sm text-gray-600">
                {milestones.filter(m => !m.achieved).length > 0 ? (
                  <div>
                    <p>Focus on these upcoming milestones:</p>
                    <ul className="mt-2 space-y-1">
                      {milestones.filter(m => !m.achieved).slice(0, 3).map(milestone => (
                        <li key={milestone.id} className="flex items-center">
                          <span className="mr-2">{milestone.icon}</span>
                          <span>{milestone.title} - {Math.round(milestone.progress)}% complete</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>🎉 Congratulations! You've achieved all available milestones. Keep up the great work!</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowMilestoneDetails(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
