import { 
  getRewards, 
  createReward,
  updateReward,
  deleteReward
} from '../services/rewardsService.js';

// Get all rewards for the Rewards page
export async function getRewardsContent(req, res, next) {
  try {
    const rewards = await getRewards();
    
    res.json({
      rewards
    });
  } catch (err) {
    next(err);
  }
}

// Rewards CRUD operations
export async function getRewardsList(req, res, next) {
  try {
    const rewards = await getRewards();
    res.json({ rewards });
  } catch (err) {
    next(err);
  }
}

export async function createRewardItem(req, res, next) {
  try {
    const reward = await createReward(req.body);
    res.status(201).json(reward);
  } catch (err) {
    next(err);
  }
}

export async function updateRewardItem(req, res, next) {
  try {
    const { id } = req.params;
    const reward = await updateReward(id, req.body);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    res.json(reward);
  } catch (err) {
    next(err);
  }
}

export async function deleteRewardItem(req, res, next) {
  try {
    const { id } = req.params;
    const reward = await deleteReward(id);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    res.json({ message: 'Reward deleted successfully', reward });
  } catch (err) {
    next(err);
  }
}
