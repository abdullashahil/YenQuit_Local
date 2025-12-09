import { query } from './src/db/index.js';

const userId = '1b5d4f80-1d3b-4653-be14-e8e2f8db0529';

async function checkAnswers() {
  try {
    console.log('Checking fivea_user_answers...');
    const fiveaResult = await query('SELECT * FROM fivea_user_answers WHERE user_id = $1', [userId]);
    console.log('FiveA user answers:', fiveaResult.rows);
    
    console.log('\nChecking fagerstrom_user_answers...');
    const fagerstromResult = await query('SELECT * FROM fagerstrom_user_answers WHERE user_id = $1', [userId]);
    console.log('Fagerström user answers:', fagerstromResult.rows);
    
    console.log('\nChecking all fagerstrom_user_answers...');
    const allFagerstrom = await query('SELECT * FROM fagerstrom_user_answers LIMIT 10');
    console.log('All Fagerström answers (sample):', allFagerstrom.rows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkAnswers();
