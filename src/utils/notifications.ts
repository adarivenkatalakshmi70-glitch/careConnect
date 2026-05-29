/**
 * Utility for handling browser Notification API integration with support for sandboxed environments.
 */

export interface NotificationStatus {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
}

/**
 * Checks if the browser supports Notification API and gets the current permission status
 */
export const getNotificationStatus = (): NotificationStatus => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { supported: false, permission: 'unsupported' };
  }
  return {
    supported: true,
    permission: Notification.permission
  };
};

/**
 * Requests notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    // Some older browsers might use callback-based requestPermission
    return new Promise((resolve) => {
      try {
        Notification.requestPermission((result) => {
          resolve(result);
        });
      } catch (e) {
        resolve('default');
      }
    });
  }
};

/**
 * Dispatches a native browser notification, falling back to a message if blocked
 */
export const sendMedicationNotification = (
  title: string,
  body: string,
  tag?: string
): boolean => {
  const status = getNotificationStatus();
  if (!status.supported || status.permission !== 'granted') {
    return false;
  }

  try {
    const options: any = {
      body,
      icon: 'https://cdn-icons-png.flaticon.com/512/822/822143.png', // Medical pill/meds generic high-quality icon
      tag: tag || 'careconnect-med',
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200]
    };

    const notification = new Notification(title, options);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (error) {
    console.warn('Native notification failed, probably due to iframe sandboxing restrictions:', error);
    return false;
  }
};

/**
 * Converts a medication timing ('Morning', 'Afternoon', 'Evening', 'Night') to hours/minutes
 */
export const getTimingTimeLabel = (timing: 'Morning' | 'Afternoon' | 'Evening' | 'Night'): { time: string; hours: number; minutes: number } => {
  switch (timing) {
    case 'Morning':
      return { time: '10:00 AM', hours: 10, minutes: 0 };
    case 'Afternoon':
      return { time: '1:00 PM', hours: 13, minutes: 0 };
    case 'Evening':
      return { time: '6:00 PM', hours: 18, minutes: 0 };
    case 'Night':
      return { time: '9:00 PM', hours: 21, minutes: 0 };
  }
};
