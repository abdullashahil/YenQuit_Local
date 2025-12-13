import { query } from '../db/index.js';

const mapReward = (row) => ({
  id: row.id,
  title: row.title,
  timeline: row.metadata?.timeline,
  benefits: row.metadata?.benefits,
  icon_name: row.icon_name,
  display_order: row.display_order,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at
});

const mapBanner = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  icon_name: row.icon_name,
  display_order: row.display_order,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at
});

export async function getRewards() {
  const result = await query(
    `SELECT id, title, icon_name, display_order, is_active, created_at, updated_at, metadata
     FROM app_resources
     WHERE type = 'reward' AND is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows.map(mapReward);
}

// Assumed to be Warning Banners based on migration analysis, 
// OR if 'reward_banners' was a thing, we treat it as type='warning_banner' (or 'reward_banner' if distinct).
// Given migration history, 'warning_banners' exists, 'reward_banners' did not. 
// I will map getRewardBanners to type='warning_banner' to be safe/consistent with existing data content.
export async function getRewardBanners() {
  const result = await query(
    `SELECT id, title, description, icon_name, display_order, is_active, created_at, updated_at
     FROM app_resources
     WHERE type = 'warning_banner' AND is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows.map(mapBanner);
}

export async function createReward(rewardData) {
  const { title, timeline, benefits, icon_name, display_order = 0 } = rewardData;
  const result = await query(
    `INSERT INTO app_resources (type, title, icon_name, display_order, metadata)
     VALUES ('reward', $1, $2, $3, $4)
     RETURNING id, title, icon_name, display_order, is_active, created_at, updated_at, metadata`,
    [title, icon_name, display_order, JSON.stringify({ timeline, benefits })]
  );
  return mapReward(result.rows[0]);
}

export async function updateReward(id, rewardData) {
  const { title, timeline, benefits, icon_name, display_order, is_active } = rewardData;

  // Need to fetch current metadata to merge if partial update, but for now assuming full update of metadata fields provided
  // Simplified: overwrite metadata fields if provided

  const fields = [];
  const values = [];
  let idx = 1;
  const metaUpdates = {};

  if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
  if (icon_name !== undefined) { fields.push(`icon_name = $${idx++}`); values.push(icon_name); }
  if (display_order !== undefined) { fields.push(`display_order = $${idx++}`); values.push(display_order); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

  if (timeline !== undefined) metaUpdates.timeline = timeline;
  if (benefits !== undefined) metaUpdates.benefits = benefits;

  // We should merge with existing metadata properly in a real scenario
  if (Object.keys(metaUpdates).length > 0) {
    // For this simple migration, we'll just set it. 
    // Ideally: jsonb_set or fetch-modify-save. 
    // Using Coalesce or just overwriting based on assumption that we send full object.
    fields.push(`metadata = metadata || $${idx++}`);
    values.push(JSON.stringify(metaUpdates));
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE app_resources 
     SET ${fields.join(', ')}
     WHERE id = $${idx} AND type = 'reward'
     RETURNING id, title, icon_name, display_order, is_active, created_at, updated_at, metadata`,
    values
  );
  return result.rows[0] ? mapReward(result.rows[0]) : null;
}

export async function deleteReward(id) {
  const result = await query(
    `UPDATE app_resources 
     SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND type = 'reward'
     RETURNING id, title, icon_name, display_order, is_active, created_at, updated_at, metadata`,
    [id]
  );
  return result.rows[0] ? mapReward(result.rows[0]) : null;
}

export async function createRewardBanner(bannerData) {
  const { title, description, icon_name, display_order = 0 } = bannerData;
  const result = await query(
    `INSERT INTO app_resources (type, title, description, icon_name, display_order)
     VALUES ('warning_banner', $1, $2, $3, $4)
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [title, description, icon_name, display_order]
  );
  return mapBanner(result.rows[0]);
}

export async function updateRewardBanner(id, bannerData) {
  const { title, description, icon_name, display_order, is_active } = bannerData;
  const fields = [];
  const values = [];
  let idx = 1;

  if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
  if (icon_name !== undefined) { fields.push(`icon_name = $${idx++}`); values.push(icon_name); }
  if (display_order !== undefined) { fields.push(`display_order = $${idx++}`); values.push(display_order); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE app_resources 
     SET ${fields.join(', ')}
     WHERE id = $${idx} AND type = 'warning_banner'
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    values
  );
  return result.rows[0] ? mapBanner(result.rows[0]) : null;
}

export async function deleteRewardBanner(id) {
  const result = await query(
    `UPDATE app_resources 
     SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND type = 'warning_banner'
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0] ? mapBanner(result.rows[0]) : null;
}
