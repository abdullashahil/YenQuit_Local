import { query } from './src/db/index.js';

async function checkIds() {
    const res = await query('SELECT id, category, question_text FROM assessment_questions ORDER BY id ASC LIMIT 10');
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit();
}
checkIds();
