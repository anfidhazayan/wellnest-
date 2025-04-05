
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { UserRound, PlusCircle, XCircle, Bell, Mic } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";

const PersonalInfoPage = () => {
  const { profile, handleChange, addEmergencyContact, removeEmergencyContact, triggerEmergencyAlert } = useElderlyProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
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
  
  return (
    <>
      <Alert className="mb-6 bg-red-50 border-red-200">
        <Bell className="h-4 w-4 text-red-600" />
        <AlertTitle>Emergency Help</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>Press the microphone button and say "Help" or "Emergency" to trigger an emergency alert</span>
          <Button 
            variant={isListening ? "destructive" : "outline"} 
            size="sm" 
            className={`ml-2 ${isListening ? "bg-red-600" : "border-red-300 text-red-600"}`}
            onClick={toggleVoiceRecognition}
          >
            <Mic className={`h-4 w-4 ${isListening ? "animate-pulse" : ""}`} />
            {isListening ? "Listening..." : "Activate Voice"}
          </Button>
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
