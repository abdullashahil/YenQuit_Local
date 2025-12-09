import * as userService from '../services/userService.js';

export async function updateProgress(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { step } = req.body || {};
    const parsed = Number(step);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 5) {
      return res.status(400).json({ error: 'Invalid step. Must be an integer between 0 and 5. Note: Step 5 (ARRANGE) is optional.' });
    }
    const updated = await userService.updateOnboardingStep(userId, parsed);
    return res.json({ onboarding_step: updated.onboarding_step, onboarding_completed: updated.onboarding_completed });
  } catch (err) {
    next(err);
  }
}
