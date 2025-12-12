import { query } from './src/db/index.js';

async function checkTables() {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('communities', 'chat_messages', 'community_members', 'community_online_users', 'message_reactions')
      ORDER BY table_name
    `);
    
    console.log('Tables found:', result.rows.map(r => r.table_name));
    
    if (result.rows.length === 0) {
      console.log('No community chat tables found in database');
    } else {
      console.log(`Found ${result.rows.length} community chat tables`);
    }
    
    // Check table structures if they exist
    for (const table of result.rows) {
      try {
        const columns = await query(`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = '${table}'
          ORDER BY ordinal_position
        `);
        console.log(`\n${table} columns:`);
        columns.rows.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
        });
      } catch (err) {
        console.log(`Could not get columns for ${table}:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('Error checking tables:', error.message);
  }
  process.exit(0);
}

checkTables();
