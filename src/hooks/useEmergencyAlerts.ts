
import { useState, useCallback, useEffect } from "react";
import { EmergencyAlert, EmergencyAlertHistory } from "@/types/emergency";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useEmergencyAlerts = (): EmergencyAlertHistory => {
  const { profile } = useElderlyProfile();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  // Fetch alerts from Supabase on component mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from("emergency_alerts")
          .select(`
            id, 
            timestamp, 
            type, 
            status, 
            description, 
            location, 
            resolved_at
          `)
          .order("timestamp", { ascending: false });

        if (error) {
          console.error("Error fetching alerts:", error);
          return;
        }

        // Fetch contacts notified for each alert
        const alertsWithContacts = await Promise.all(
          data.map(async (alert) => {
            const { data: contactsData, error: contactsError } = await supabase
              .from("alert_contacts_notified")
              .select("contact_name")
              .eq("alert_id", alert.id);

            if (contactsError) {
              console.error("Error fetching contacts:", contactsError);
              return {
                ...alert,
                contactsNotified: []
              };
            }

            return {
              id: alert.id,
              timestamp: new Date(alert.timestamp),
              type: alert.type,
              status: alert.status,
              description: alert.description,
              location: alert.location,
              resolvedAt: alert.resolved_at ? new Date(alert.resolved_at) : undefined,
              contactsNotified: contactsData.map(contact => contact.contact_name)
            };
          })
        );

        setAlerts(alertsWithContacts);
      } catch (error) {
        console.error("Error in fetchAlerts:", error);
      }
    };

    // Call the async function
    fetchAlerts();

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
          fetchAlerts();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addAlert = useCallback(
    async (alert: Omit<EmergencyAlert, "id" | "timestamp">) => {
      try {
        // Insert the alert into Supabase
        const { data: alertData, error: alertError } = await supabase
          .from("emergency_alerts")
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
        const contactsToNotify = alert.contactsNotified || 
          profile.emergencyContacts.map(contact => contact.name);

        const contactPromises = contactsToNotify.map(contactName => 
          supabase
            .from("alert_contacts_notified")
            .insert({
              alert_id: alertData.id,
              contact_name: contactName
            })
        );

        await Promise.all(contactPromises);

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
    [profile.emergencyContacts]
  );

  const updateAlertStatus = useCallback(
    async (id: string, status: EmergencyAlert["status"], resolvedAt?: Date) => {
      try {
        const { error } = await supabase
          .from("emergency_alerts")
          .update({ 
            status, 
            resolved_at: status === "resolved" ? resolvedAt || new Date() : null 
          })
          .eq("id", id);

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

  const getActiveAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("emergency_alerts")
        .select(`
          id, 
          timestamp, 
          type, 
          status, 
          description, 
          location, 
          resolved_at
        `)
        .eq("status", "active")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching active alerts:", error);
        return [];
      }

      // Fetch contacts notified for each alert
      const activeAlertsWithContacts = await Promise.all(
        data.map(async (alert) => {
          const { data: contactsData, error: contactsError } = await supabase
            .from("alert_contacts_notified")
            .select("contact_name")
            .eq("alert_id", alert.id);

          if (contactsError) {
            console.error("Error fetching contacts:", contactsError);
            return {
              ...alert,
              contactsNotified: []
            };
          }

          return {
            id: alert.id,
            timestamp: new Date(alert.timestamp),
            type: alert.type,
            status: alert.status,
            description: alert.description,
            location: alert.location,
            resolvedAt: alert.resolved_at ? new Date(alert.resolved_at) : undefined,
            contactsNotified: contactsData.map(contact => contact.contact_name)
          };
        })
      );

      return activeAlertsWithContacts;
    } catch (error) {
      console.error("Error in getActiveAlerts:", error);
      return [];
    }
  }, []);

  const getAllAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("emergency_alerts")
        .select(`
          id, 
          timestamp, 
          type, 
          status, 
          description, 
          location, 
          resolved_at
        `)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching all alerts:", error);
        return [];
      }

      // Fetch contacts notified for each alert
      const allAlertsWithContacts = await Promise.all(
        data.map(async (alert) => {
          const { data: contactsData, error: contactsError } = await supabase
            .from("alert_contacts_notified")
            .select("contact_name")
            .eq("alert_id", alert.id);

          if (contactsError) {
            console.error("Error fetching contacts:", contactsError);
            return {
              ...alert,
              contactsNotified: []
            };
          }

          return {
            id: alert.id,
            timestamp: new Date(alert.timestamp),
            type: alert.type,
            status: alert.status,
            description: alert.description,
            location: alert.location,
            resolvedAt: alert.resolved_at ? new Date(alert.resolved_at) : undefined,
            contactsNotified: contactsData.map(contact => contact.contact_name)
          };
        })
      );

      return allAlertsWithContacts;
    } catch (error) {
      console.error("Error in getAllAlerts:", error);
      return [];
    }
  }, []);

  return {
    alerts,
    addAlert,
    updateAlertStatus,
    getActiveAlerts,
    getAllAlerts
  };
};
