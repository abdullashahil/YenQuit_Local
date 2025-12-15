import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import userService from '../../../services/userService';
import quitTrackerService from '../../../services/quitTrackerService';

interface SavingsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavingsCalculator({ isOpen, onClose }: SavingsCalculatorProps) {
  const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
  const [days, setDays] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userSmokingCount, setUserSmokingCount] = useState(0);
  const [pricePerCigarette, setPricePerCigarette] = useState(20);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalCigarettesSmoked, setTotalCigarettesSmoked] = useState(0);
  const [calculatedSavings, setCalculatedSavings] = useState(0);

  // Fetch user data from fivea_user_answers
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Fetch user answers to get smoking count and price
        const answersResponse = await userService.getUserAnswers();
        if (answersResponse.success && answersResponse.data) {
          let smokingCount = 0;
          let cigarettePrice = 20; // Default fallback

          // Get smoking count from question_id 26 (smoked) or 34 (smokeless)
          const smokingAnswer = answersResponse.data.find((answer: any) => answer.question_id === 26 || answer.question_id === 34);
          if (smokingAnswer && smokingAnswer.answer_text) {
            const smokingText = smokingAnswer.answer_text;

            if (smokingText.includes('Less than 5')) {
              smokingCount = 4;
            } else if (smokingText.includes('5-10')) {
              smokingCount = 8;
            } else if (smokingText.includes('11-20')) {
              smokingCount = 15;
            } else if (smokingText.includes('More than 20')) {
              smokingCount = 25;
            } else if (smokingText.includes('10 or less')) { // Fagerstrom fallback
              smokingCount = 8;
            } else if (smokingText.includes('21-30')) { // Fagerstrom fallback
              smokingCount = 25;
            } else if (smokingText.includes('31 or more')) { // Fagerstrom fallback
              smokingCount = 35;
            }
          }

          // Get price per cigarette from question_id 27 (smoked) or 33 (smokeless)
          const priceAnswer = answersResponse.data.find((answer: any) => answer.question_id === 27 || answer.question_id === 33);
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

          setUserSmokingCount(smokingCount);
          setPricePerCigarette(cigarettePrice);

          // Fetch daily logs to calculate total cigarettes smoked
          const logsResponse = await quitTrackerService.getLogs();
          if (logsResponse.logs) {
            const logs = logsResponse.logs;
            setTotalLogs(logs.length);

            // Sum up all cigarettes smoked from logs
            const totalSmoked = logs.reduce((sum: number, log: any) => {
              return sum + (log.cigarettes_count || 0);
            }, 0);
            setTotalCigarettesSmoked(totalSmoked);

            // Calculate savings using the real formula
            const savings = Math.max(0, (logs.length * smokingCount - totalSmoked) * cigarettePrice);
            setCalculatedSavings(savings);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  // Manual calculation for user input
  const calculateSavings = () => {
    return Math.round(cigarettesPerDay * days * pricePerCigarette);
  };

  // Real calculation based on user data
  const calculateRealSavings = () => {
    if (totalLogs === 0) return 0;
    const result = (totalLogs * userSmokingCount - totalCigarettesSmoked) * pricePerCigarette;
    return result;
  };

  // Check if savings is negative (user smoked more than previous habit)
  const isNegativeSavings = calculateRealSavings() < 0;
  const potentialSavings = Math.abs(calculateRealSavings());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Savings Calculator</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              {/* Real Savings Calculation */}
              <div className={`p-4 rounded-lg border ${isNegativeSavings ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                <p className="text-sm text-gray-700 mb-1">
                  {isNegativeSavings ? 'You could have saved:' : 'Your Actual Savings:'}
                </p>
                <p className={`text-3xl font-bold ${isNegativeSavings ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{potentialSavings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Based on your {totalLogs} days of progress
                </p>
                {isNegativeSavings && (
                  <p className="text-xs text-red-600 mt-2">
                    You smoked more than your previous habit. Consider reducing your intake.
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p>• Previous usage: {userSmokingCount} cigarettes/day</p>
                  <p>• Actually smoked: {totalCigarettesSmoked} cigarettes</p>
                  <p>• Price per cigarette: ₹{pricePerCigarette}</p>
                  <p>• Expected: {totalLogs * userSmokingCount} cigarettes</p>
                  <p>• Difference: {totalCigarettesSmoked - (totalLogs * userSmokingCount)} cigarettes</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3">Estimate savings for different scenarios:</p>

                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="cigarettes" className="text-gray-700">Cigarettes per day</Label>
                    <Input
                      id="cigarettes"
                      type="number"
                      min="0"
                      value={cigarettesPerDay || ''}
                      onChange={(e) => setCigarettesPerDay(Number(e.target.value))}
                      className="bg-white border-gray-300"
                      placeholder="Enter number of cigarettes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="days" className="text-gray-700">Number of days</Label>
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="bg-white border-gray-300"
                      placeholder="Enter number of days"
                    />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">Estimated Savings:</p>
                    <p className="text-2xl font-bold text-blue-600">₹{calculateSavings().toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Based on ₹{pricePerCigarette} per cigarette</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
