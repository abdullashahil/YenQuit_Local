import { apiGet } from './http';

export async function getMyAdvice() {
  return apiGet('/advice/me');
}
