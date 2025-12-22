
import { query } from '../src/db/index.js';

const up = async () => {
    console.log('Starting migration...');
    try {
        await query(`
            ALTER TABLE user_learning_progress 
            ADD COLUMN IF NOT EXISTS image_view_count INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS text_view_count INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS ai_interaction_count INTEGER DEFAULT 0;
        `);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
};

up();
