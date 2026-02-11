import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from './button';

interface NotificationPermissionModalProps {
    onClose: () => void;
}

export function NotificationPermissionModal({ onClose }: NotificationPermissionModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if we should show the modal
        const shouldShow = checkShouldShowModal();
        setIsVisible(shouldShow);
    }, []);

    const checkShouldShowModal = (): boolean => {
        // Don't show if notifications not supported
        if (!('Notification' in window)) {
            return false;
        }

        // Don't show if permission already granted or denied
        if (Notification.permission !== 'default') {
            return false;
        }

        // Don't show if user previously dismissed
        const dismissed = localStorage.getItem('notificationPermissionDismissed');
        if (dismissed === 'true') {
            return false;
        }

        return true;
    };

    const handleEnableNotifications = async () => {
        try {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
                localStorage.setItem('notificationPermissionGranted', 'true');
            } else {
                console.log('❌ Notification permission denied');
                localStorage.setItem('notificationPermissionDismissed', 'true');
            }

            setIsVisible(false);
            onClose();
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            setIsVisible(false);
            onClose();
        }
    };

    const handleMaybeLater = () => {
        localStorage.setItem('notificationPermissionDismissed', 'true');
        setIsVisible(false);
        onClose();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
                <button
                    onClick={handleMaybeLater}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-[#20B2AA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="text-[#20B2AA]" size={32} />
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Stay on Track with Reminders
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                        Get daily motivation, progress check-ins, and weekly tips to support your quit journey.
                        We'll send you helpful reminders at the times you choose.
                    </p>

                    {/* Benefits List */}
                    <div className="text-left bg-gray-50 rounded-2xl p-4 mb-6">
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start">
                                <span className="text-[#20B2AA] mr-2">🌟</span>
                                <span>Daily motivation to start your day strong</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#20B2AA] mr-2">📊</span>
                                <span>Evening check-ins to track your progress</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#20B2AA] mr-2">💡</span>
                                <span>Weekly expert tips for staying tobacco-free</span>
                            </li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleEnableNotifications}
                            className="w-full px-6 py-3 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white font-medium"
                        >
                            Enable Notifications
                        </Button>
                        <Button
                            onClick={handleMaybeLater}
                            variant="outline"
                            className="w-full px-6 py-3 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
