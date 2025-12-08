import { 
  getHealthRisks, 
  getWarningBanners,
  createHealthRisk,
  updateHealthRisk,
  deleteHealthRisk,
  createWarningBanner,
  updateWarningBanner,
  deleteWarningBanner
} from '../services/risksService.js';

// Get all health risks and warning banners for the Risks page
export async function getRisksContent(req, res, next) {
  try {
    const [healthRisks, warningBanners] = await Promise.all([
      getHealthRisks(),
      getWarningBanners()
    ]);
    
    res.json({
      healthRisks,
      warningBanners
    });
  } catch (err) {
    next(err);
  }
}

// Health Risks CRUD operations
export async function getHealthRisksList(req, res, next) {
  try {
    const healthRisks = await getHealthRisks();
    res.json({ healthRisks });
  } catch (err) {
    next(err);
  }
}

export async function createHealthRiskItem(req, res, next) {
  try {
    const healthRisk = await createHealthRisk(req.body);
    res.status(201).json(healthRisk);
  } catch (err) {
    next(err);
  }
}

export async function updateHealthRiskItem(req, res, next) {
  try {
    const { id } = req.params;
    const healthRisk = await updateHealthRisk(id, req.body);
    if (!healthRisk) return res.status(404).json({ error: 'Health risk not found' });
    res.json(healthRisk);
  } catch (err) {
    next(err);
  }
}

export async function deleteHealthRiskItem(req, res, next) {
  try {
    const { id } = req.params;
    const healthRisk = await deleteHealthRisk(id);
    if (!healthRisk) return res.status(404).json({ error: 'Health risk not found' });
    res.json({ message: 'Health risk deleted successfully', healthRisk });
  } catch (err) {
    next(err);
  }
}

// Warning Banners CRUD operations
export async function getWarningBannersList(req, res, next) {
  try {
    const warningBanners = await getWarningBanners();
    res.json({ warningBanners });
  } catch (err) {
    next(err);
  }
}

export async function createWarningBannerItem(req, res, next) {
  try {
    const warningBanner = await createWarningBanner(req.body);
    res.status(201).json(warningBanner);
  } catch (err) {
    next(err);
  }
}

export async function updateWarningBannerItem(req, res, next) {
  try {
    const { id } = req.params;
    const warningBanner = await updateWarningBanner(id, req.body);
    if (!warningBanner) return res.status(404).json({ error: 'Warning banner not found' });
    res.json(warningBanner);
  } catch (err) {
    next(err);
  }
}

export async function deleteWarningBannerItem(req, res, next) {
  try {
    const { id } = req.params;
    const warningBanner = await deleteWarningBanner(id);
    if (!warningBanner) return res.status(404).json({ error: 'Warning banner not found' });
    res.json({ message: 'Warning banner deleted successfully', warningBanner });
  } catch (err) {
    next(err);
  }
}
