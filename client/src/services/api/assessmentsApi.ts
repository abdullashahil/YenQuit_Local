import { apiGet, apiPost } from './http';

export async function submitFagerstrom(answers: Record<string, number>) {
  return apiPost('/assessments/fagerstrom', { answers });
}

export async function getLatestFagerstrom() {
  return apiGet('/assessments/fagerstrom/latest');
}

export async function submitReadiness(readinessScore: number, notes?: string) {
  return apiPost('/assessments/readiness', { readinessScore, notes });
}
