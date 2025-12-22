
import { query } from '../src/db/index.js';

const run = async () => {
    try {
        console.log('--- Table Schema Information ---');
        const schemaRes = await query(`
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'user_learning_progress';
        `);
        console.table(schemaRes.rows);

        console.log('\n--- Sample Data ---');
        const dataRes = await query(`
            SELECT id, user_id, content_ids, image_view_count, text_view_count, ai_interaction_count 
            FROM user_learning_progress 
            LIMIT 5;
        `);
        console.table(dataRes.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
};

run();
