const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Roadblock {
  id: number;
  title: string;
  description: string;
  resolution: string;
  display_order: number;
}

export interface RoadblocksContent {
  roadblocks: Roadblock[];
}

// Get all roadblocks content for the Roadblocks page
export async function getRoadblocksContent(): Promise<RoadblocksContent> {
  const res = await fetch(`${API_URL}/api/roadblocks/content`);
  if (!res.ok) {
    throw new Error('Failed to fetch roadblocks content');
  }
  return res.json();
}

// Get roadblocks only
export async function getRoadblocks(): Promise<Roadblock[]> {
  const res = await fetch(`${API_URL}/api/roadblocks/roadblocks`);
  if (!res.ok) {
    throw new Error('Failed to fetch roadblocks');
  }
  const data = await res.json();
  return data.roadblocks;
}

// Admin functions (require authentication)
export async function createRoadblock(roadblockData: Partial<Roadblock>): Promise<Roadblock> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/roadblocks/roadblocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(roadblockData),
  });

  if (!res.ok) {
    throw new Error('Failed to create roadblock');
  }
  return res.json();
}

export async function updateRoadblock(id: number, roadblockData: Partial<Roadblock>): Promise<Roadblock> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/roadblocks/roadblocks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(roadblockData),
  });

  if (!res.ok) {
    throw new Error('Failed to update roadblock');
  }
  return res.json();
}

export async function deleteRoadblock(id: number): Promise<{ message: string; roadblock: Roadblock }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/roadblocks/roadblocks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete roadblock');
  }
  return res.json();
}
