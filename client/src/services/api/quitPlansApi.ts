import { apiGet, apiPut } from './http';

export async function getMyQuitPlan() {
  return apiGet('/quit-plans/me');
}

export interface QuitPlanPayload {
  quitDate?: string;
  triggers?: string[];
  strategies?: string[];
  supportContacts?: Record<string, unknown>;
}

export async function saveMyQuitPlan(payload: QuitPlanPayload) {
  return apiPut('/quit-plans/me', payload);
}
