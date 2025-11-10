import { Card } from "../../ui/card";
import { Heart, Flame, Award, IndianRupee, Badge, GraduationCap } from "lucide-react";
import { useState } from 'react';
import { SavingsCalculator } from './SavingsCalculator';

export function StatsSnapshot() {
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);

  const handleNavigation = (path: string) => {
    window.location.href = path;
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
      value: "212",
      unit: "Rs",
      icon: IndianRupee,
      color: "#20B2AA",
      onClick: () => setShowSavingsCalculator(true)
    },
    {
      label: "Health Score",
      value: "97",
      unit: "%",
      icon: Heart,
      color: "#20B2AA",
      onClick: () => {}
    },
    {
      label: "Milestones",
      value: "3",
      unit: "achieved",
      icon: Award,
      color: "#20B2AA",
      onClick: () => {}
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
    </>
  );
}
