import { getUserNotificationPreferences, NotificationPreference } from '../services/notificationService';

interface NotificationContent {
    title: string;
    body: string;
    icon: string;
}

const NOTIFICATION_CONTENT: Record<string, NotificationContent> = {
    daily_motivation: {
        title: '🌟 Daily Motivation',
        body: "You're doing great! Stay strong on your quit journey today.",
        icon: '/images/YenQuit_logo.jpg',
    },
    progress_checkin: {
        title: '📊 Progress Check-In',
        body: 'Take a moment to reflect on your day and log your progress.',
        icon: '/images/YenQuit_logo.jpg',
    },
    weekly_tip: {
        title: '💡 Weekly Tip',
        body: "Check out this week's expert advice for staying tobacco-free!",
        icon: '/images/YenQuit_logo.jpg',
    },
};

let schedulerInterval: NodeJS.Timeout | null = null;
let notificationPreferences: NotificationPreference[] = [];

/**
 * Get the scheduled time for a notification (use custom time or default)
 */
function getScheduledTime(notification: NotificationPreference): string {
    return notification.time || notification.default_time;
}

/**
 * Check if a notification was already sent today
 */
function wasSentToday(notificationKey: string): boolean {
    const lastSent = localStorage.getItem(`notification_last_sent_${notificationKey}`);
    if (!lastSent) return false;

    const lastSentDate = new Date(lastSent);
    const today = new Date();

    return (
        lastSentDate.getDate() === today.getDate() &&
        lastSentDate.getMonth() === today.getMonth() &&
        lastSentDate.getFullYear() === today.getFullYear()
    );
}

/**
 * Check if a notification was already sent this week
 */
function wasSentThisWeek(notificationKey: string): boolean {
    const lastSent = localStorage.getItem(`notification_last_sent_${notificationKey}`);
    if (!lastSent) return false;

    const lastSentDate = new Date(lastSent);
    const today = new Date();

    // Get the start of this week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    return lastSentDate >= startOfWeek;
}

/**
 * Mark a notification as sent
 */
function markAsSent(notificationKey: string): void {
    localStorage.setItem(`notification_last_sent_${notificationKey}`, new Date().toISOString());
}

/**
 * Check if current time matches scheduled time (HH:MM format)
 */
function isTimeMatch(scheduledTime: string, now: Date): boolean {
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Extract HH:MM from scheduled time (might be HH:MM:SS format)
    const scheduledHHMM = scheduledTime.substring(0, 5);

    return currentTime === scheduledHHMM;
}

/**
 * Check if notification should be sent
 */
function shouldSendNotification(notification: NotificationPreference, now: Date): boolean {
    // Check if enabled
    if (!notification.enabled) {
        return false;
    }

    // Check if time matches
    const scheduledTime = getScheduledTime(notification);
    if (!isTimeMatch(scheduledTime, now)) {
        return false;
    }

    // Check if already sent based on notification type
    if (notification.key === 'weekly_tip') {
        // Only send on Mondays (day 1)
        if (now.getDay() !== 1) {
            return false;
        }

        // Check if sent this week
        if (wasSentThisWeek(notification.key)) {
            return false;
        }
    } else {
        // Daily notifications
        if (wasSentToday(notification.key)) {
            return false;
        }
    }

    return true;
}

/**
 * Send a browser notification
 */
function sendBrowserNotification(notification: NotificationPreference): void {
    if (!('Notification' in window)) {
        console.warn('Browser does not support notifications');
        return;
    }

    if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
    }

    const content = NOTIFICATION_CONTENT[notification.key];
    if (!content) {
        console.warn(`No content defined for notification key: ${notification.key}`);
        return;
    }

    try {
        const browserNotification = new Notification(content.title, {
            body: content.body,
            icon: content.icon,
            badge: content.icon,
            tag: notification.key,
            requireInteraction: false,
        });

        // Handle notification click
        browserNotification.onclick = () => {
            window.focus();
            browserNotification.close();

            // Navigate based on notification type
            if (notification.key === 'progress_checkin') {
                window.location.href = '/app/profile';
            } else {
                window.location.href = '/app';
            }
        };

        console.log(`✅ Notification sent: ${notification.key}`);
        markAsSent(notification.key);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

/**
 * Check and send notifications
 */
async function checkAndSendNotifications(): Promise<void> {
    const now = new Date();

    for (const notification of notificationPreferences) {
        if (shouldSendNotification(notification, now)) {
            sendBrowserNotification(notification);
        }
    }
}

/**
 * Fetch notification preferences from API
 */
async function fetchNotificationPreferences(): Promise<void> {
    try {
        const response = await getUserNotificationPreferences();
        notificationPreferences = response.notifications || [];
        console.log('📋 Notification preferences loaded:', notificationPreferences.length);
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
        notificationPreferences = [];
    }
}

/**
 * Start the notification scheduler
 */
export async function startNotificationScheduler(): Promise<void> {
    if (schedulerInterval) {
        console.log('⚠️ Notification scheduler already running');
        return;
    }

    // Check if notifications are supported and permitted
    if (!('Notification' in window)) {
        console.warn('Browser does not support notifications');
        return;
    }

    if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
    }

    console.log('🚀 Starting notification scheduler...');

    // Fetch preferences immediately
    await fetchNotificationPreferences();

    // Check immediately
    await checkAndSendNotifications();

    // Then check every 60 seconds
    schedulerInterval = setInterval(async () => {
        await checkAndSendNotifications();
    }, 60000); // 60 seconds

    // Refresh preferences every 5 minutes
    setInterval(async () => {
        await fetchNotificationPreferences();
    }, 300000); // 5 minutes

    console.log('✅ Notification scheduler started');
}

/**
 * Stop the notification scheduler
 */
export function stopNotificationScheduler(): void {
    if (schedulerInterval) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
        notificationPreferences = [];
        console.log('🛑 Notification scheduler stopped');
    }
}
