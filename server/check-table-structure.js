import { query } from './src/db/index.js';

async function checkTableStructure() {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('communities', 'chat_messages', 'community_members', 'community_online_users', 'message_reactions')
      ORDER BY table_name
    `);
    
    console.log(`Found ${result.rows.length} community chat tables\n`);
    
    // Check table structures if they exist
    for (const tableRow of result.rows) {
      const tableName = tableRow.table_name;
      try {
        const columns = await query(`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [tableName]);
        
        console.log(`${tableName.toUpperCase()} columns:`);
        columns.rows.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
        });
        console.log('');
      } catch (err) {
        console.log(`Could not get columns for ${tableName}:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('Error checking tables:', error.message);
  }
  process.exit(0);
}

checkTableStructure();
