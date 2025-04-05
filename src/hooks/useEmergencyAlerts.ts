
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { EmergencyAlert, EmergencyAlertHistory } from "@/types/emergency";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { toast } from "@/hooks/use-toast";

export const useEmergencyAlerts = (): EmergencyAlertHistory => {
  const { profile } = useElderlyProfile();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(() => {
    // Try to load from localStorage on initialization
    const savedAlerts = localStorage.getItem("emergencyAlerts");
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("emergencyAlerts", JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = useCallback(
    (alert: Omit<EmergencyAlert, "id" | "timestamp">) => {
      const newAlert: EmergencyAlert = {
        ...alert,
        id: uuidv4(),
        timestamp: new Date(),
        contactsNotified: 
          alert.contactsNotified || 
          profile.emergencyContacts.map(contact => contact.name)
      };

      setAlerts(prev => [newAlert, ...prev]);
      
      toast({
        title: "Emergency Alert Created",
        description: `An emergency alert has been triggered. ${newAlert.contactsNotified.length} contacts notified.`,
        variant: "destructive",
      });

      return newAlert.id;
    },
    [profile.emergencyContacts]
  );

  const updateAlertStatus = useCallback(
    (id: string, status: EmergencyAlert["status"], resolvedAt?: Date) => {
      let found = false;

      setAlerts(prev => 
        prev.map(alert => {
          if (alert.id === id) {
            found = true;
            return { 
              ...alert, 
              status, 
              resolvedAt: status === "resolved" ? resolvedAt || new Date() : alert.resolvedAt 
            };
          }
          return alert;
        })
      );

      if (found && status === "resolved") {
        toast({
          title: "Alert Resolved",
          description: "The emergency alert has been marked as resolved.",
        });
      } else if (found && status === "canceled") {
        toast({
          title: "Alert Canceled",
          description: "The emergency alert has been canceled.",
        });
      }

      return found;
    },
    []
  );

  const getActiveAlerts = useCallback(
    () => alerts.filter(alert => alert.status === "active"),
    [alerts]
  );

  const getAllAlerts = useCallback(() => [...alerts], [alerts]);

  return {
    alerts,
    addAlert,
    updateAlertStatus,
    getActiveAlerts,
    getAllAlerts
  };
};
