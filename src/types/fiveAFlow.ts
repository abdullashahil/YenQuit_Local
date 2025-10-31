// Re-export the FiveAData type from AppContext to maintain a single source of truth
export type { FiveAData } from '../context/AppContext';

export interface FiveA_AskProps {
  onNext: (data: any) => void;
}

export interface FiveA_AdviseProps {
  onNext: () => void;
  userData: any;
}

export interface FiveA_AssessProps {
  onNext: (data: any) => void;
}

export interface FiveA_AssistProps {
  onNext: (data: any) => void;
  onComplete: () => void;
}

export interface FiveA_ArrangeProps {
  onComplete: () => void;
  quitDate?: Date;
}
