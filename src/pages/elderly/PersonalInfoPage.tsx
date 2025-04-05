
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { UserRound, PlusCircle, XCircle, Bell, Mic, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PersonalInfoPage = () => {
  const { profile, handleChange, addEmergencyContact, removeEmergencyContact, triggerEmergencyAlert, emergencyAlerts } = useElderlyProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [emergencyType, setEmergencyType] = useState<"emergency" | "medical" | "fall" | "other">("emergency");
  const [emergencyDescription, setEmergencyDescription] = useState("");

  const activeAlerts = emergencyAlerts.getActiveAlerts();
  
  const form = useForm({
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
      email: ""
    }
  });

  const onSubmit = (values: any) => {
    addEmergencyContact(values);
    form.reset();
    setIsDialogOpen(false);
  };

  const toggleVoiceRecognition = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
          // Real implementation would go here
          triggerEmergencyAlert();
        } else {
          triggerEmergencyAlert(); // Trigger anyway for demo
        }
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleEmergencyAlertSubmit = () => {
    triggerEmergencyAlert(emergencyType, emergencyDescription);
    setEmergencyDescription("");
  };

  const handleResolveAlert = (alertId: string) => {
    emergencyAlerts.updateAlertStatus(alertId, "resolved");
  };

  const handleCancelAlert = (alertId: string) => {
    emergencyAlerts.updateAlertStatus(alertId, "canceled");
  };
  
  return (
    <>
      <Alert className="mb-6 bg-red-50 border-red-200">
        <Bell className="h-4 w-4 text-red-600" />
        <AlertTitle>Emergency Help</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>Press the microphone button and say "Help" or "Emergency" to trigger an emergency alert</span>
          <div className="flex gap-2">
            {activeAlerts.length > 0 && (
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
          
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label>Emergency Contacts</Label>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" {...form.register("name", { required: true })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input id="relationship" {...form.register("relationship", { required: true })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" {...form.register("phone", { required: true })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input id="email" {...form.register("email")} />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Add Contact</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {profile.emergencyContacts.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No emergency contacts added yet.</p>
            ) : (
              <div className="space-y-2">
                {profile.emergencyContacts.map((contact, index) => (
                  <div key={index} className="border rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{contact.name} ({contact.relationship})</h4>
                        <p className="text-sm text-gray-600">📞 {contact.phone}</p>
                        {contact.email && <p className="text-sm text-gray-600">✉️ {contact.email}</p>}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeEmergencyContact(index)}
                        className="text-red-500 h-8 w-8 p-0"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PersonalInfoPage;
