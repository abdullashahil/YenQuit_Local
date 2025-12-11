const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Reward {
  id: number;
  title: string;
  timeline: string;
  benefits: string[];
  icon_name: string;
  display_order: number;
}

export interface RewardsContent {
  rewards: Reward[];
}

// Get all rewards content for the Rewards page
export async function getRewardsContent(): Promise<RewardsContent> {
  const res = await fetch(`${API_URL}/rewards/content`);
  if (!res.ok) {
    throw new Error('Failed to fetch rewards content');
  }
  return res.json();
}

// Get rewards only
export async function getRewards(): Promise<Reward[]> {
  const res = await fetch(`${API_URL}/rewards/rewards`);
  if (!res.ok) {
    throw new Error('Failed to fetch rewards');
  }
  const data = await res.json();
  return data.rewards;
}

// Admin functions (require authentication)
export async function createReward(rewardData: Partial<Reward>): Promise<Reward> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/rewards/rewards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(rewardData),
  });

  if (!res.ok) {
    throw new Error('Failed to create reward');
  }
  return res.json();
}

export async function updateReward(id: number, rewardData: Partial<Reward>): Promise<Reward> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/rewards/rewards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(rewardData),
  });

  if (!res.ok) {
    throw new Error('Failed to update reward');
  }
  return res.json();
}

export async function deleteReward(id: number): Promise<{ message: string; reward: Reward }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/rewards/rewards/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete reward');
  }
  return res.json();
}
