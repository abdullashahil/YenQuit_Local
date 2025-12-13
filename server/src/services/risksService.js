import { query } from '../db/index.js';

const mapHealthRisk = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  severity: row.metadata?.severity,
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

export async function getHealthRisks() {
  const result = await query(
    `SELECT id, title, description, icon_name, display_order, is_active, created_at, updated_at, metadata
     FROM app_resources
     WHERE type = 'health_risk' AND is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows.map(mapHealthRisk);
}

export async function getWarningBanners() {
  const result = await query(
    `SELECT id, title, description, icon_name, display_order, is_active, created_at, updated_at
     FROM app_resources
     WHERE type = 'warning_banner' AND is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows.map(mapBanner);
}

export async function createHealthRisk(riskData) {
  const { title, description, severity, icon_name, display_order = 0 } = riskData;
  const result = await query(
    `INSERT INTO app_resources (type, title, description, icon_name, display_order, metadata)
     VALUES ('health_risk', $1, $2, $3, $4, $5)
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at, metadata`,
    [title, description, icon_name, display_order, JSON.stringify({ severity })]
  );
  return mapHealthRisk(result.rows[0]);
}

export async function updateHealthRisk(id, riskData) {
  const { title, description, severity, icon_name, display_order, is_active } = riskData;

  const fields = [];
  const values = [];
  let idx = 1;
  const metaUpdates = {};

  if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
  if (icon_name !== undefined) { fields.push(`icon_name = $${idx++}`); values.push(icon_name); }
  if (display_order !== undefined) { fields.push(`display_order = $${idx++}`); values.push(display_order); }
  if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }

  if (severity !== undefined) metaUpdates.severity = severity;

  if (Object.keys(metaUpdates).length > 0) {
    fields.push(`metadata = metadata || $${idx++}`);
    values.push(JSON.stringify(metaUpdates));
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE app_resources 
     SET ${fields.join(', ')}
     WHERE id = $${idx} AND type = 'health_risk'
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at, metadata`,
    values
  );
  return result.rows[0] ? mapHealthRisk(result.rows[0]) : null;
}

export async function deleteHealthRisk(id) {
  const result = await query(
    `UPDATE app_resources 
     SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND type = 'health_risk'
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at, metadata`,
    [id]
  );
  return result.rows[0] ? mapHealthRisk(result.rows[0]) : null;
}

export async function createWarningBanner(bannerData) {
  const { title, description, icon_name, display_order = 0 } = bannerData;
  const result = await query(
    `INSERT INTO app_resources (type, title, description, icon_name, display_order)
     VALUES ('warning_banner', $1, $2, $3, $4)
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [title, description, icon_name, display_order]
  );
  return mapBanner(result.rows[0]);
}

export async function updateWarningBanner(id, bannerData) {
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

export async function deleteWarningBanner(id) {
  const result = await query(
    `UPDATE app_resources 
     SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND type = 'warning_banner'
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0] ? mapBanner(result.rows[0]) : null;
}
