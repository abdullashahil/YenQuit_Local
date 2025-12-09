import { 
  getRoadblocks,
  createRoadblock,
  updateRoadblock,
  deleteRoadblock
} from '../services/roadblocksService.js';

// Get all roadblocks for the Roadblocks page
export async function getRoadblocksContent(req, res, next) {
  try {
    const roadblocks = await getRoadblocks();
    
    res.json({
      roadblocks
    });
  } catch (err) {
    next(err);
  }
}

// Roadblocks CRUD operations
export async function getRoadblocksList(req, res, next) {
  try {
    const roadblocks = await getRoadblocks();
    res.json({ roadblocks });
  } catch (err) {
    next(err);
  }
}

export async function createRoadblockItem(req, res, next) {
  try {
    const roadblock = await createRoadblock(req.body);
    res.status(201).json(roadblock);
  } catch (err) {
    next(err);
  }
}

export async function updateRoadblockItem(req, res, next) {
  try {
    const { id } = req.params;
    const roadblock = await updateRoadblock(id, req.body);
    if (!roadblock) return res.status(404).json({ error: 'Roadblock not found' });
    res.json(roadblock);
  } catch (err) {
    next(err);
  }
}

export async function deleteRoadblockItem(req, res, next) {
  try {
    const { id } = req.params;
    const roadblock = await deleteRoadblock(id);
    if (!roadblock) return res.status(404).json({ error: 'Roadblock not found' });
    res.json({ message: 'Roadblock deleted successfully', roadblock });
  } catch (err) {
    next(err);
  }
}
