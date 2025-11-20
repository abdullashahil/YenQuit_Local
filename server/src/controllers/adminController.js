import { setConfig, getConfig, setContent, getContent, audit, analyticsOverview } from '../services/adminService.js';

export async function putConfig(req, res, next) {
  try {
    const { key, value } = req.body || {};
    if (!key) return res.status(400).json({ error: 'key is required' });
    const row = await setConfig(key, value ?? {}, req.user?.userId);
    await audit(req.user?.userId, 'config_updated', { key });
    res.json({ config: row });
  } catch (err) { next(err); }
}

export async function getConfigByKey(req, res, next) {
  try {
    const { key } = req.params;
    const row = await getConfig(key);
    res.json({ config: row });
  } catch (err) { next(err); }
}

export async function putContent(req, res, next) {
  try {
    const { slug, content } = req.body || {};
    if (!slug) return res.status(400).json({ error: 'slug is required' });
    const row = await setContent(slug, content ?? {}, req.user?.userId);
    await audit(req.user?.userId, 'content_updated', { slug });
    res.json({ content: row });
  } catch (err) { next(err); }
}

export async function getContentBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const row = await getContent(slug);
    res.json({ content: row });
  } catch (err) { next(err); }
}

export async function getOverview(req, res, next) {
  try {
    const data = await analyticsOverview();
    res.json({ analytics: data });
  } catch (err) { next(err); }
}
