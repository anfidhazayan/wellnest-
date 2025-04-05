
import { useState, useCallback, useEffect } from "react";
import { EmergencyAlert, EmergencyAlertHistory } from "@/types/emergency";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Helper to convert database row to EmergencyAlert type
const convertToEmergencyAlert = (dbAlert: any, contactsNotified: string[] = []): EmergencyAlert => {
  return {
    id: dbAlert.id,
    timestamp: new Date(dbAlert.timestamp),
    type: dbAlert.type as "emergency" | "medical" | "fall" | "other",
    status: dbAlert.status as "active" | "resolved" | "canceled",
    description: dbAlert.description,
    location: dbAlert.location,
    resolvedAt: dbAlert.resolved_at ? new Date(dbAlert.resolved_at) : undefined,
    contactsNotified
  };
};

export const useEmergencyAlerts = (): EmergencyAlertHistory => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  // Fetch alerts from database
  const fetchAlerts = useCallback(async () => {
    try {
      const { data: alertsData, error: alertsError } = await supabase
        .from('emergency_alerts')
        .select('*')
        .order('timestamp', { ascending: false });

      if (alertsError) {
        console.error("Error fetching alerts:", alertsError);
        return [];
      }

      // Fetch contacts notified for each alert
      const alertsWithContacts = await Promise.all(
        alertsData.map(async (alert) => {
          const { data: contactsData, error: contactsError } = await supabase
            .from('alert_contacts_notified')
            .select('contact_name')
            .eq('alert_id', alert.id);

          if (contactsError) {
            console.error("Error fetching contacts:", contactsError);
            return convertToEmergencyAlert(alert, []);
          }

          const contactNames = contactsData ? contactsData.map(c => c.contact_name) : [];
          return convertToEmergencyAlert(alert, contactNames);
        })
      );

      return alertsWithContacts;
    } catch (error) {
      console.error("Error in fetchAlerts:", error);
      return [];
    }
  }, []);

  // Initialize alerts on component mount
  useEffect(() => {
    const initializeAlerts = async () => {
      const alerts = await fetchAlerts();
      setAlerts(alerts);
    };

    initializeAlerts();

    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_alerts'
        },
        () => {
          // Refresh the alerts when there's a change
          initializeAlerts();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAlerts]);

  // Add a new alert
  const addAlert = useCallback(
    async (alert: Omit<EmergencyAlert, "id" | "timestamp">): Promise<string> => {
      try {
        // Insert the alert into database
        const { data: alertData, error: alertError } = await supabase
          .from('emergency_alerts')
          .insert({
            type: alert.type,
            status: alert.status,
            description: alert.description,
            location: alert.location
          })
          .select()
          .single();

        if (alertError) {
          console.error("Error adding alert:", alertError);
          toast({
            title: "Error",
            description: "Failed to create emergency alert.",
            variant: "destructive",
          });
          return "";
        }

        // Insert the contacts notified
        const contactsToNotify = alert.contactsNotified || [];

        for (const contactName of contactsToNotify) {
          const { error: contactError } = await supabase
            .from('alert_contacts_notified')
            .insert({
              alert_id: alertData.id,
              contact_name: contactName
            });

          if (contactError) {
            console.error("Error adding contact notification:", contactError);
          }
        }

        toast({
          title: "Emergency Alert Created",
          description: `An emergency alert has been triggered. ${contactsToNotify.length} contacts notified.`,
          variant: "destructive",
        });

        return alertData.id;
      } catch (error) {
        console.error("Error in addAlert:", error);
        toast({
          title: "Error",
          description: "Failed to create emergency alert.",
          variant: "destructive",
        });
        return "";
      }
    },
    []
  );

  // Update an alert's status
  const updateAlertStatus = useCallback(
    async (id: string, status: EmergencyAlert["status"], resolvedAt?: Date): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('emergency_alerts')
          .update({ 
            status, 
            resolved_at: status === "resolved" ? resolvedAt || new Date() : null 
          })
          .eq('id', id);

        if (error) {
          console.error("Error updating alert status:", error);
          return false;
        }

        if (status === "resolved") {
          toast({
            title: "Alert Resolved",
            description: "The emergency alert has been marked as resolved.",
          });
        } else if (status === "canceled") {
          toast({
            title: "Alert Canceled",
            description: "The emergency alert has been canceled.",
          });
        }

        return true;
      } catch (error) {
        console.error("Error in updateAlertStatus:", error);
        return false;
      }
    },
    []
  );

  // Get active alerts
  const getActiveAlerts = useCallback(async (): Promise<EmergencyAlert[]> => {
    try {
      const { data: alertsData, error: alertsError } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('status', 'active')
        .order('timestamp', { ascending: false });

      if (alertsError) {
        console.error("Error fetching active alerts:", alertsError);
        return [];
      }

      // Fetch contacts notified for each alert
      const activeAlertsWithContacts = await Promise.all(
        alertsData.map(async (alert) => {
          const { data: contactsData, error: contactsError } = await supabase
            .from('alert_contacts_notified')
            .select('contact_name')
            .eq('alert_id', alert.id);

          if (contactsError) {
            console.error("Error fetching contacts:", contactsError);
            return convertToEmergencyAlert(alert, []);
          }

          const contactNames = contactsData ? contactsData.map(c => c.contact_name) : [];
          return convertToEmergencyAlert(alert, contactNames);
        })
      );

      return activeAlertsWithContacts;
    } catch (error) {
      console.error("Error in getActiveAlerts:", error);
      return [];
    }
  }, []);

  // Get all alerts
  const getAllAlerts = useCallback(async (): Promise<EmergencyAlert[]> => {
    try {
      return await fetchAlerts();
    } catch (error) {
      console.error("Error in getAllAlerts:", error);
      return [];
    }
  }, [fetchAlerts]);

  return {
    alerts,
    addAlert,
    updateAlertStatus,
    getActiveAlerts,
    getAllAlerts
  };
};
