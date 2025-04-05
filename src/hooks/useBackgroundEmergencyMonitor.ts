
import { useEffect, useCallback, useState } from 'react';
import { useElderlyProfile } from '@/contexts/ElderlyProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Default time values
const DEFAULT_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes
const DEFAULT_MAX_INACTIVITY = 24 * 60 * 60 * 1000; // 24 hours

interface BackgroundMonitorConfig {
  enabled: boolean;
  checkInterval?: number; // milliseconds between checks
  maxInactivityPeriod?: number; // milliseconds of inactivity before alert
}

export const useBackgroundEmergencyMonitor = (config: BackgroundMonitorConfig) => {
  const { profile } = useElderlyProfile();
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  
  // Initialize the service worker
  useEffect(() => {
    if (!config.enabled || !('serviceWorker' in navigator)) {
      return;
    }

    const setupServiceWorker = async () => {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/emergency-service-worker.js');
        setServiceWorkerRegistration(registration);
        console.log('Emergency service worker registered:', registration);
        
        // Create or open the IndexedDB database to store profile data
        const dbRequest = indexedDB.open('emergency-app-storage', 1);
        
        dbRequest.onupgradeneeded = (event) => {
          const db = (event.target as IDBRequest).result;
          
          // Create object stores if they don't exist
          if (!db.objectStoreNames.contains('profile')) {
            db.createObjectStore('profile');
          }
          
          if (!db.objectStoreNames.contains('config')) {
            db.createObjectStore('config');
          }
        };
        
        dbRequest.onsuccess = (event) => {
          const db = (event.target as IDBRequest).result;
          
          // Store the profile data for the service worker to access
          const transaction = db.transaction(['profile'], 'readwrite');
          const profileStore = transaction.objectStore('profile');
          profileStore.put(profile, 'current-profile');
          
          // Store the Supabase configuration
          const configTransaction = db.transaction(['config'], 'readwrite');
          const configStore = configTransaction.objectStore('config');
          configStore.put({
            supabaseUrl: "https://yunjarkgxyxucduqtkqo.supabase.co",
            supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bmphcmtneHl4dWNkdXF0a3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTQ5ODUsImV4cCI6MjA1OTQzMDk4NX0.mpsAOmYrwgkOZZMxern1ljYqhtc4j80ougiTyo1ixPY"
          }, 'supabase-config');
        };
        
        dbRequest.onerror = (event) => {
          console.error('Error opening IndexedDB:', event);
        };
        
      } catch (error) {
        console.error('Service worker registration failed:', error);
        toast({
          title: "Background monitoring error",
          description: "Failed to initialize background emergency monitoring.",
          variant: "destructive",
        });
      }
    };

    setupServiceWorker();
    
    // Cleanup function
    return () => {
      if (serviceWorkerRegistration) {
        serviceWorkerRegistration.unregister().then((success) => {
          if (success) {
            console.log('Emergency service worker unregistered');
          }
        });
      }
    };
  }, [config.enabled, profile]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (!serviceWorkerRegistration || !config.enabled) {
      return false;
    }
    
    try {
      if (navigator.serviceWorker.controller) {
        // Configure the service worker with monitoring settings
        navigator.serviceWorker.controller.postMessage({
          type: 'REGISTER_EMERGENCY_CHECK',
          interval: config.checkInterval || DEFAULT_CHECK_INTERVAL,
          maxInactivityPeriod: config.maxInactivityPeriod || DEFAULT_MAX_INACTIVITY
        });
        
        setIsMonitoringActive(true);
        
        toast({
          title: "Background monitoring active",
          description: "Emergency alerts will be sent automatically if no activity is detected.",
        });
        
        return true;
      } else {
        console.error('No active service worker found');
        return false;
      }
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      return false;
    }
  }, [serviceWorkerRegistration, config]);

  // Update profile data in IndexedDB when it changes
  useEffect(() => {
    if (!config.enabled || !isMonitoringActive) {
      return;
    }
    
    const updateProfileData = () => {
      const dbRequest = indexedDB.open('emergency-app-storage', 1);
      
      dbRequest.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        const transaction = db.transaction(['profile'], 'readwrite');
        const store = transaction.objectStore('profile');
        store.put(profile, 'current-profile');
      };
    };
    
    updateProfileData();
  }, [profile, config.enabled, isMonitoringActive]);

  // Function to send activity pings
  const sendActivityPing = useCallback(() => {
    if (navigator.serviceWorker.controller && isMonitoringActive) {
      navigator.serviceWorker.controller.postMessage({ type: 'ACTIVITY_PING' });
    }
  }, [isMonitoringActive]);

  // Set up activity tracking
  useEffect(() => {
    if (!config.enabled || !isMonitoringActive) {
      return;
    }
    
    // Send ping on user activity events
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      sendActivityPing();
    };
    
    // Add event listeners for user activity
    activityEvents.forEach(eventType => {
      window.addEventListener(eventType, handleUserActivity);
    });
    
    // Send initial ping
    sendActivityPing();
    
    // Setup periodic pings while the app is open
    const pingInterval = setInterval(sendActivityPing, 5 * 60 * 1000); // every 5 minutes
    
    return () => {
      // Clean up event listeners
      activityEvents.forEach(eventType => {
        window.removeEventListener(eventType, handleUserActivity);
      });
      
      clearInterval(pingInterval);
    };
  }, [config.enabled, isMonitoringActive, sendActivityPing]);

  return {
    startMonitoring,
    isMonitoringActive,
    sendActivityPing
  };
};
