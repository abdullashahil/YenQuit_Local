import express from 'express';
import { ConfigService } from '../services/configService.js';
import axios from 'axios';

const router = express.Router();

// GET /api/config - Get all system configuration
router.get('/', async (req, res) => {
    try {
        const settings = await ConfigService.getAll();

        // Mask sensitive keys for display if needed, or send as is if this is admin-only protected route
        // For now, sending as is but frontend handles masking logic visualy. 
        // Ideally we might want to return masked versions like 'sk_...' but the user wants to ability to change/edit them.
        // If we return masked, we need a way to know if it's "set" or not.

        res.json(settings);
    } catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ error: 'Failed to fetch configuration' });
    }
});

// POST /api/config - Update system configuration
router.post('/', async (req, res) => {
    try {
        const { aiApiKey, aiModel } = req.body;

        // Validate inputs
        // (Add more specific validation if needed)

        if (aiApiKey !== undefined) {
            await ConfigService.set('OPENROUTER_API_KEY', aiApiKey);
        }

        if (aiModel !== undefined) {
            await ConfigService.set('AI_MODEL', aiModel);
        }

        res.json({ success: true, message: 'Configuration saved successfully' });
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({ error: 'Failed to update configuration' });
    }
});

// POST /api/config/test-ai - Test the AI connection
router.post('/test-ai', async (req, res) => {
    try {
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'API Key is required for testing' });
        }

        // Call OpenRouter with a simple ping/model check
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: 'mistralai/mistral-7b-instruct:free',
                    messages: [{ role: 'user', content: 'Hi' }],
                    max_tokens: 5
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://yenquit.com',
                    }
                }
            );

            if (response.status === 200) {
                res.json({ success: true, message: 'Connection successful!' });
            } else {
                throw new Error('Unexpected status code: ' + response.status);
            }
        } catch (apiError) {
            console.error('OpenRouter Test Error:', apiError.response?.data || apiError.message);
            return res.status(400).json({
                success: false,
                error: 'Connection failed',
                details: apiError.response?.data?.error?.message || apiError.message
            });
        }

    } catch (error) {
        console.error('Test AI Connection Error:', error);
        res.status(500).json({ error: 'Internal server error during test' });
    }
});

export default router;
