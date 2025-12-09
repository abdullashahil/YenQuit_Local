const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface HealthRisk {
  id: number;
  title: string;
  description: string;
  severity: 'high' | 'medium';
  icon_name: string;
  display_order: number;
}

export interface WarningBanner {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
}

export interface RisksContent {
  healthRisks: HealthRisk[];
  warningBanners: WarningBanner[];
}

// Get all risks content for the Risks page
export async function getRisksContent(): Promise<RisksContent> {
  const res = await fetch(`${API_URL}/api/risks/content`);
  if (!res.ok) {
    throw new Error('Failed to fetch risks content');
  }
  return res.json();
}

// Get health risks only
export async function getHealthRisks(): Promise<HealthRisk[]> {
  const res = await fetch(`${API_URL}/api/risks/health-risks`);
  if (!res.ok) {
    throw new Error('Failed to fetch health risks');
  }
  const data = await res.json();
  return data.healthRisks;
}

// Get warning banners only
export async function getWarningBanners(): Promise<WarningBanner[]> {
  const res = await fetch(`${API_URL}/api/risks/warning-banners`);
  if (!res.ok) {
    throw new Error('Failed to fetch warning banners');
  }
  const data = await res.json();
  return data.warningBanners;
}

// Admin functions (require authentication)
export async function createHealthRisk(riskData: Partial<HealthRisk>): Promise<HealthRisk> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/risks/health-risks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(riskData),
  });

  if (!res.ok) {
    throw new Error('Failed to create health risk');
  }
  return res.json();
}

export async function updateHealthRisk(id: number, riskData: Partial<HealthRisk>): Promise<HealthRisk> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/risks/health-risks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(riskData),
  });

  if (!res.ok) {
    throw new Error('Failed to update health risk');
  }
  return res.json();
}

export async function deleteHealthRisk(id: number): Promise<{ message: string; healthRisk: HealthRisk }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/risks/health-risks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete health risk');
  }
  return res.json();
}

export async function createWarningBanner(bannerData: Partial<WarningBanner>): Promise<WarningBanner> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/risks/warning-banners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bannerData),
  });

  if (!res.ok) {
    throw new Error('Failed to create warning banner');
  }
  return res.json();
}

export async function updateWarningBanner(id: number, bannerData: Partial<WarningBanner>): Promise<WarningBanner> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/risks/warning-banners/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bannerData),
  });

  if (!res.ok) {
    throw new Error('Failed to update warning banner');
  }
  return res.json();
}

export async function deleteWarningBanner(id: number): Promise<{ message: string; warningBanner: WarningBanner }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/risks/warning-banners/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete warning banner');
  }
  return res.json();
}
