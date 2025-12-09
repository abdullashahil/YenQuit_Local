import { query } from '../db/index.js';

export async function getHealthRisks() {
  const result = await query(
    `SELECT id, title, description, severity, icon_name, display_order
     FROM health_risks
     WHERE is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows;
}

export async function getWarningBanners() {
  const result = await query(
    `SELECT id, title, description, icon_name, display_order
     FROM warning_banners
     WHERE is_active = TRUE
     ORDER BY display_order ASC, id ASC`
  );
  return result.rows;
}

export async function createHealthRisk(riskData) {
  const { title, description, severity, icon_name, display_order = 0 } = riskData;
  const result = await query(
    `INSERT INTO health_risks (title, description, severity, icon_name, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, description, severity, icon_name, display_order, is_active, created_at, updated_at`,
    [title, description, severity, icon_name, display_order]
  );
  return result.rows[0];
}

export async function updateHealthRisk(id, riskData) {
  const { title, description, severity, icon_name, display_order, is_active } = riskData;
  const result = await query(
    `UPDATE health_risks 
     SET title = $1, description = $2, severity = $3, icon_name = $4, display_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, title, description, severity, icon_name, display_order, is_active, created_at, updated_at`,
    [title, description, severity, icon_name, display_order, is_active, id]
  );
  return result.rows[0];
}

export async function deleteHealthRisk(id) {
  const result = await query(
    `UPDATE health_risks 
     SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, title, description, severity, icon_name, display_order, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0];
}

export async function createWarningBanner(bannerData) {
  const { title, description, icon_name, display_order = 0 } = bannerData;
  const result = await query(
    `INSERT INTO warning_banners (title, description, icon_name, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [title, description, icon_name, display_order]
  );
  return result.rows[0];
}

export async function updateWarningBanner(id, bannerData) {
  const { title, description, icon_name, display_order, is_active } = bannerData;
  const result = await query(
    `UPDATE warning_banners 
     SET title = $1, description = $2, icon_name = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [title, description, icon_name, display_order, is_active, id]
  );
  return result.rows[0];
}

export async function deleteWarningBanner(id) {
  const result = await query(
    `UPDATE warning_banners 
     SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, title, description, icon_name, display_order, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0];
}
