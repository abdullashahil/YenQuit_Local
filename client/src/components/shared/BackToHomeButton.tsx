import React from 'react';
import { useRouter } from 'next/router';

interface BackToHomeButtonProps {
  className?: string;
}

export function BackToHomeButton({ className = '' }: BackToHomeButtonProps) {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/app');
  };

  return (
    <button
      onClick={handleBackToHome}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-opacity-80 ${className}`}
      style={{
        backgroundColor: '#E0F2FE',
        color: '#0284C7',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to Home
    </button>
  );
}
