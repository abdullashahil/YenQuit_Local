import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface SavingsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavingsCalculator({ isOpen, onClose }: SavingsCalculatorProps) {
  const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
  const [days, setDays] = useState(1);
  const pricePerCigarette = 17; // Average price per cigarette in INR
  
  const calculateSavings = () => {
    return Math.round(cigarettesPerDay * days * pricePerCigarette);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Savings Calculator</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
