import { query } from '../db/index.js';

export async function getRoadblocks() {
  const result = await query(
    `SELECT id, title, description, resolution, display_order
     FROM roadblocks
     WHERE is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows;
}

export async function createRoadblock(roadblockData) {
  const { title, description, resolution, display_order = 0 } = roadblockData;
  const result = await query(
    `INSERT INTO roadblocks (title, description, resolution, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, resolution, display_order, is_active, created_at, updated_at`,
    [title, description, resolution, display_order]
  );
  return result.rows[0];
}

export async function updateRoadblock(id, roadblockData) {
  const { title, description, resolution, display_order, is_active } = roadblockData;
  const result = await query(
    `UPDATE roadblocks 
     SET title = $1, description = $2, resolution = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING id, title, description, resolution, display_order, is_active, created_at, updated_at`,
    [title, description, resolution, display_order, is_active, id]
  );
  return result.rows[0];
}

export async function deleteRoadblock(id) {
  const result = await query(
    `UPDATE roadblocks 
     SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, title, description, resolution, display_order, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0];
}
