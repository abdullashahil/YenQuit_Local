import React from 'react';

interface WillingToQuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pathway: '5As' | '5Rs') => void;
}

export const WillingToQuitModal: React.FC<WillingToQuitModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelect 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 
          className="text-center mb-8 text-2xl font-bold"
          style={{ color: '#1C3B5E' }}
        >
          Are you willing to Quit this habit?
        </h2>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <button
            onClick={() => onSelect('5As')}
            className="flex-1 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: '#20B2AA',
              color: '#FFFFFF',
            }}
          >
            <div>
              <div className="mb-1 font-semibold">Yes, I'm Ready</div>
              <div style={{ opacity: 0.9, fontSize: '0.875rem' }}>Start 5 A's Framework</div>
            </div>
          </button>

          <button
            onClick={() => onSelect('5Rs')}
            className="flex-1 py-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#20B2AA',
              border: '2px solid #20B2AA'
            }}
          >
            <div>
              <div className="mb-1 font-semibold">No, I Need Motivation</div>
              <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>Start 5 R's Framework</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
