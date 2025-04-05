
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { UserRound, Clock, AlertTriangle } from "lucide-react";
import EmergencyAlertBanner from "@/components/emergency/EmergencyAlertBanner";
import EmergencyContactsList from "@/components/emergency/EmergencyContactsList";
import { EmergencyAlert } from "@/types/emergency";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useBackgroundEmergencyMonitor } from "@/hooks/useBackgroundEmergencyMonitor";
import { toast } from "@/hooks/use-toast";

const PersonalInfoPage = () => {
  const { profile, handleChange, addEmergencyContact, removeEmergencyContact, triggerEmergencyAlert, emergencyAlerts } = useElderlyProfile();
  const [isListening, setIsListening] = useState(false);
  const [emergencyType, setEmergencyType] = useState<"emergency" | "medical" | "fall" | "other">("emergency");
  const [emergencyDescription, setEmergencyDescription] = useState("");
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundMonitoringEnabled, setBackgroundMonitoringEnabled] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState(6 * 60 * 60 * 1000); // 6 hours by default

  // Initialize the background monitoring hook
  const { startMonitoring, isMonitoringActive } = useBackgroundEmergencyMonitor({
    enabled: backgroundMonitoringEnabled,
    maxInactivityPeriod: monitoringInterval
  });

  useEffect(() => {
    const fetchActiveAlerts = async () => {
      setLoading(true);
      try {
        const alerts = await emergencyAlerts.getActiveAlerts();
        setActiveAlerts(alerts);
      } catch (error) {
        console.error("Error fetching active alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAlerts();

    // Set up an interval to refresh active alerts every 30 seconds
    const intervalId = setInterval(fetchActiveAlerts, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [emergencyAlerts]);

  const toggleVoiceRecognition = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
          // Real implementation would go here
          handleEmergencyAlertSubmit();
        } else {
          handleEmergencyAlertSubmit(); // Trigger anyway for demo
        }
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleEmergencyAlertSubmit = async () => {
    await triggerEmergencyAlert(emergencyType, emergencyDescription);
    setEmergencyDescription("");
    
    // Refresh the active alerts
    const alerts = await emergencyAlerts.getActiveAlerts();
    setActiveAlerts(alerts);
  };

  const handleResolveAlert = async (alertId: string) => {
    await emergencyAlerts.updateAlertStatus(alertId, "resolved");
    // Refresh the active alerts
    const alerts = await emergencyAlerts.getActiveAlerts();
    setActiveAlerts(alerts);
  };

  const handleCancelAlert = async (alertId: string) => {
    await emergencyAlerts.updateAlertStatus(alertId, "canceled");
    // Refresh the active alerts
    const alerts = await emergencyAlerts.getActiveAlerts();
    setActiveAlerts(alerts);
  };

  const handleToggleBackgroundMonitoring = () => {
    const newState = !backgroundMonitoringEnabled;
    
    if (newState && 'serviceWorker' in navigator) {
      setBackgroundMonitoringEnabled(newState);
      
      // Small delay to allow state update before starting
      setTimeout(() => {
        const success = startMonitoring();
        
        if (!success) {
          setBackgroundMonitoringEnabled(false);
          toast({
            title: "Error",
            description: "Failed to start background monitoring. Please try again.",
            variant: "destructive",
          });
        }
      }, 100);
    } else if (!newState) {
      // Just turn it off
      setBackgroundMonitoringEnabled(false);
      toast({
        title: "Background monitoring disabled",
        description: "Emergency alerts will no longer be sent automatically.",
      });
    } else {
      // Service workers not supported
      toast({
        title: "Not supported",
        description: "Your browser doesn't support background monitoring.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <EmergencyAlertBanner 
        activeAlerts={activeAlerts}
        loading={loading}
        isListening={isListening}
        emergencyType={emergencyType}
        emergencyDescription={emergencyDescription}
        setEmergencyType={setEmergencyType}
        setEmergencyDescription={setEmergencyDescription}
        toggleVoiceRecognition={toggleVoiceRecognition}
        handleEmergencyAlertSubmit={handleEmergencyAlertSubmit}
        handleResolveAlert={handleResolveAlert}
        handleCancelAlert={handleCancelAlert}
      />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 text-amber-600 mr-2" />
            Background Emergency Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Automatic Emergency Alerts</h3>
              <p className="text-sm text-gray-500">
                Automatically trigger an emergency alert if no activity is detected for an extended period.
                This helps ensure your safety even when you're not actively using the app.
              </p>
            </div>
            <Switch
              checked={backgroundMonitoringEnabled}
              onCheckedChange={handleToggleBackgroundMonitoring}
              aria-label="Toggle background emergency monitoring"
            />
          </div>
          
          {backgroundMonitoringEnabled && (
            <div className="pl-4 border-l-2 border-amber-200">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-amber-700 font-medium">
                  Status: {isMonitoringActive ? "Active" : "Starting..."}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                An emergency alert will be triggered if no activity is detected for:
              </p>
              <div className="flex gap-2 items-center">
                <select 
                  className="p-2 border rounded-md"
                  value={monitoringInterval}
                  onChange={(e) => setMonitoringInterval(parseInt(e.target.value))}
                >
                  <option value={3 * 60 * 60 * 1000}>3 hours</option>
                  <option value={6 * 60 * 60 * 1000}>6 hours</option>
                  <option value={12 * 60 * 60 * 1000}>12 hours</option>
                  <option value={24 * 60 * 60 * 1000}>24 hours</option>
                </select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startMonitoring()}
                  disabled={!backgroundMonitoringEnabled}
                >
                  Apply
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: This feature uses service workers and will continue to work even when this tab is closed,
                but requires your browser to be running.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserRound className="h-5 w-5 text-medical-600 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" value={profile.age} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={profile.address} onChange={handleChange} />
          </div>
          
          <EmergencyContactsList 
            contacts={profile.emergencyContacts}
            addContact={addEmergencyContact}
            removeContact={removeEmergencyContact}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default PersonalInfoPage;
