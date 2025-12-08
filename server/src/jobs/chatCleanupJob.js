import cron from 'node-cron';
import { cleanupOldChatMessages } from '../services/chatService.js';

/**
 * Chat cleanup job that runs daily at 2 AM to delete messages older than 7 days
 */
export const startChatCleanupJob = () => {
  // Schedule cleanup job to run daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('🧹 Starting chat cleanup job...');
    try {
      const deletedRows = await cleanupOldChatMessages();
      console.log(`✅ Chat cleanup completed: Deleted ${deletedRows} old chat log entries`);
    } catch (error) {
      console.error('❌ Chat cleanup job failed:', error);
    }
  });

  console.log('📅 Chat cleanup job scheduled: Daily at 2:00 AM');
};

/**
 * Manual cleanup function for testing or immediate cleanup
 */
export const runCleanupNow = async () => {
  console.log('🧹 Running manual chat cleanup...');
  try {
    const deletedRows = await cleanupOldChatMessages();
    console.log(`✅ Manual cleanup completed: Deleted ${deletedRows} old chat log entries`);
    return deletedRows;
  } catch (error) {
    console.error('❌ Manual cleanup failed:', error);
    throw error;
  }
};
