import { query } from '../db/index.js';

export async function getRewards() {
  const result = await query(
    `SELECT id, title, timeline, benefits, icon_name, display_order
     FROM rewards
     WHERE is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows;
}

export async function getRewardBanners() {
  const result = await query(
    `SELECT id, title, description, icon_name, display_order
     FROM reward_banners
     WHERE is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows;
}

export async function createReward(rewardData) {
  const { title, timeline, benefits, icon_name, display_order = 0 } = rewardData;
  const result = await query(
    `INSERT INTO rewards (title, timeline, benefits, icon_name, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, timeline, benefits, icon_name, display_order, is_active, created_at, updated_at`,
    [title, timeline, benefits, icon_name, display_order]
  );
  return result.rows[0];
}

export async function updateReward(id, rewardData) {
  const { title, timeline, benefits, icon_name, display_order, is_active } = rewardData;
  const result = await query(
    `UPDATE rewards 
     SET title = $1, timeline = $2, benefits = $3, icon_name = $4, display_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, title, timeline, benefits, icon_name, display_order, is_active, created_at, updated_at`,
    [title, timeline, benefits, icon_name, display_order, is_active, id]
  );
  return result.rows[0];
}

export async function deleteReward(id) {
  const result = await query(
    `UPDATE rewards 
     SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, title, timeline, benefits, icon_name, display_order, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0];
}

export async function createRewardBanner(bannerData) {
  const { title, description, icon_name, display_order = 0 } = bannerData;
  const result = await query(
    `INSERT INTO reward_banners (title, description, icon_name, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [title, description, icon_name, display_order]
  );
  return result.rows[0];
}

export async function updateRewardBanner(id, bannerData) {
  const { title, description, icon_name, display_order, is_active } = bannerData;
  const result = await query(
    `UPDATE reward_banners 
     SET title = $1, description = $2, icon_name = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [title, description, icon_name, display_order, is_active, id]
  );
  return result.rows[0];
}

export async function deleteRewardBanner(id) {
  const result = await query(
    `UPDATE reward_banners 
     SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0];
}
