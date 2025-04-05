
import React, { useState } from "react";
import { Bell, Mic, AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmergencyAlert } from "@/types/emergency";

interface EmergencyAlertBannerProps {
  activeAlerts: EmergencyAlert[];
  loading: boolean;
  isListening: boolean;
  emergencyType: "emergency" | "medical" | "fall" | "other";
  emergencyDescription: string;
  setEmergencyType: (type: "emergency" | "medical" | "fall" | "other") => void;
  setEmergencyDescription: (description: string) => void;
  toggleVoiceRecognition: () => void;
  handleEmergencyAlertSubmit: () => Promise<void>;
  handleResolveAlert: (alertId: string) => Promise<void>;
  handleCancelAlert: (alertId: string) => Promise<void>;
}

const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  activeAlerts,
  loading,
  isListening,
  emergencyType,
  emergencyDescription,
  setEmergencyType,
  setEmergencyDescription,
  toggleVoiceRecognition,
  handleEmergencyAlertSubmit,
  handleResolveAlert,
  handleCancelAlert
}) => {
  return (
    <Alert className="mb-6 bg-red-50 border-red-200">
      <Bell className="h-4 w-4 text-red-600" />
      <AlertTitle>Emergency Help</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>Press the microphone button and say "Help" or "Emergency" to trigger an emergency alert</span>
        <div className="flex gap-2">
          {loading ? (
            <Button 
              variant="outline" 
              size="sm" 
              disabled
              className="border-gray-300"
            >
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Loading...
            </Button>
          ) : activeAlerts.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-300 text-red-600"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Active Emergency Alerts</SheetTitle>
                  <SheetDescription>
                    Currently active emergency alerts that have been triggered.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {activeAlerts.map(alert => (
                    <div key={alert.id} className="border border-red-200 rounded-md p-4 bg-red-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-red-800 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      {alert.description && (
                        <p className="text-sm mb-2">{alert.description}</p>
                      )}
                      {alert.location && (
                        <p className="text-sm text-gray-600 mb-2">Location: {alert.location}</p>
                      )}
                      <p className="text-sm text-gray-600 mb-4">
                        Contacts notified: {alert.contactsNotified.join(", ")}
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCancelAlert(alert.id)}
                        >
                          Cancel Alert
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
              >
                Trigger Alert
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Trigger Emergency Alert</AlertDialogTitle>
                <AlertDialogDescription>
                  This will notify your emergency contacts and emergency services.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyType">Emergency Type</Label>
                  <Select 
                    value={emergencyType} 
                    onValueChange={(value: any) => setEmergencyType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency (General)</SelectItem>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="fall">Fall Detected</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyDescription">Description (Optional)</Label>
                  <Textarea 
                    id="emergencyDescription" 
                    placeholder="Describe the emergency situation..." 
                    value={emergencyDescription}
                    onChange={(e) => setEmergencyDescription(e.target.value)}
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmergencyAlertSubmit} className="bg-red-600 hover:bg-red-700">
                  Trigger Alert
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant={isListening ? "destructive" : "outline"} 
            size="sm" 
            className={`${isListening ? "bg-red-600" : "border-red-300 text-red-600"}`}
            onClick={toggleVoiceRecognition}
          >
            <Mic className={`h-4 w-4 ${isListening ? "animate-pulse" : ""}`} />
            {isListening ? "Listening..." : "Activate Voice"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmergencyAlertBanner;
