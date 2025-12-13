import { query } from '../db/index.js';

const mapRoadblock = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  resolution: row.metadata?.resolution,
  display_order: row.display_order,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at
});

export async function getRoadblocks() {
  const result = await query(
    `SELECT id, title, description, display_order, is_active, created_at, updated_at, metadata
     FROM app_resources
     WHERE type = 'roadblock' AND is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows.map(mapRoadblock);
}

export async function createRoadblock(roadblockData) {
  const { title, description, resolution, display_order = 0 } = roadblockData;
  const result = await query(
    `INSERT INTO app_resources (type, title, description, display_order, metadata)
     VALUES ('roadblock', $1, $2, $3, $4)
     RETURNING id, title, description, display_order, is_active, created_at, updated_at, metadata`,
    [title, description, display_order, JSON.stringify({ resolution })]
  );
  return mapRoadblock(result.rows[0]);
}

export async function updateRoadblock(id, roadblockData) {
  const { title, description, resolution, display_order, is_active } = roadblockData;

  const fields = [];
  const values = [];
  let idx = 1;
  const metaUpdates = {};

  if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
  if (display_order !== undefined) { fields.push(`display_order = $${idx++}`); values.push(display_order); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

  if (resolution !== undefined) metaUpdates.resolution = resolution;

  if (Object.keys(metaUpdates).length > 0) {
    fields.push(`metadata = metadata || $${idx++}`);
    values.push(JSON.stringify(metaUpdates));
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE app_resources 
     SET ${fields.join(', ')}
     WHERE id = $${idx} AND type = 'roadblock'
     RETURNING id, title, description, display_order, is_active, created_at, updated_at, metadata`,
    values
  );
  return result.rows[0] ? mapRoadblock(result.rows[0]) : null;
}

export async function deleteRoadblock(id) {
  const result = await query(
    `UPDATE app_resources 
     SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND type = 'roadblock'
     RETURNING id, title, description, display_order, is_active, created_at, updated_at, metadata`,
    [id]
  );
  return result.rows[0] ? mapRoadblock(result.rows[0]) : null;
}
