import { apiGet, apiPut } from './http';

export async function putConfig(key: string, value: unknown) {
  return apiPut('/admin/configs', { key, value });
}
export async function getConfig(key: string) {
  return apiGet(`/admin/configs/${encodeURIComponent(key)}`);
}

export async function putContent(slug: string, content: unknown) {
  return apiPut('/admin/content', { slug, content });
}
export async function getContent(slug: string) {
  return apiGet(`/admin/content/${encodeURIComponent(slug)}`);
}

export async function getAnalyticsOverview() {
  return apiGet('/admin/analytics/overview');
}
