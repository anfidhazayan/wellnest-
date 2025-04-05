
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { UserRound } from "lucide-react";
import EmergencyAlertBanner from "@/components/emergency/EmergencyAlertBanner";
import EmergencyContactsList from "@/components/emergency/EmergencyContactsList";
import { EmergencyAlert } from "@/types/emergency";

const PersonalInfoPage = () => {
  const { profile, handleChange, addEmergencyContact, removeEmergencyContact, triggerEmergencyAlert, emergencyAlerts } = useElderlyProfile();
  const [isListening, setIsListening] = useState(false);
  const [emergencyType, setEmergencyType] = useState<"emergency" | "medical" | "fall" | "other">("emergency");
  const [emergencyDescription, setEmergencyDescription] = useState("");
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);

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
