import { apiGet, apiPost } from './http';

export async function postRelevance(goals: string[], notes?: string) {
  return apiPost('/5r/relevance', { goals, notes });
}
export async function latestRelevance() {
  return apiGet('/5r/relevance/latest');
}

export async function postRisks(risks: string[], notes?: string) {
  return apiPost('/5r/risks', { risks, notes });
}
export async function latestRisks() {
  return apiGet('/5r/risks/latest');
}

export async function postRewards(rewards: string[], estimatedMonthlySavings?: number, notes?: string) {
  return apiPost('/5r/rewards', { rewards, estimatedMonthlySavings, notes });
}
export async function latestRewards() {
  return apiGet('/5r/rewards/latest');
}

export async function postRoadblocks(barriers: string[], strategies: string[], notes?: string) {
  return apiPost('/5r/roadblocks', { barriers, strategies, notes });
}
export async function latestRoadblocks() {
  return apiGet('/5r/roadblocks/latest');
}

export async function postRepetition(schedule: Record<string, unknown>, active = true) {
  return apiPost('/5r/repetition', { schedule, active });
}
export async function listRepetition() {
  return apiGet('/5r/repetition');
}
