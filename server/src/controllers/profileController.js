import * as profileService from '../services/profileService.js';

export async function getMe(req, res, next) {
  try {
    const user = await profileService.getUserById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const profile = await profileService.getProfileByUserId(req.user.userId);
    res.json({ user, profile });
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req, res, next) {
  try {
    const updated = await profileService.updateProfileByUserId(req.user.userId, req.body);
    if (!updated) return res.status(400).json({ error: 'No profile fields updated' });
    res.json({ profile: updated });
  } catch (err) {
    next(err);
  }
}
