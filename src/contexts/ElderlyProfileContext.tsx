
import React, { createContext, useContext, useState } from "react";
import { Appointment } from "@/types/appointment";
import { toast } from "@/hooks/use-toast";

type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
};

type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string;
  notes?: string;
};

type ElderlyProfile = {
  name: string;
  age: number;
  address: string;
  emergencyContacts: EmergencyContact[];
  medicalConditions: string;
  medications: Medication[];
  allergies: string;
  doctorInfo: string;
  notes: string;
  appointments: Appointment[];
};

type ElderlyProfileContextType = {
  profile: ElderlyProfile;
  setProfile: React.Dispatch<React.SetStateAction<ElderlyProfile>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSave: () => void;
  addMedication: (medication: Medication) => void;
  removeMedication: (index: number) => void;
  addAppointment: (appointment: Appointment) => void;
  removeAppointment: (id: string) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (index: number) => void;
  triggerEmergencyAlert: () => void;
};

const initialProfile = {
  name: "Elizabeth Johnson",
  age: 78,
  address: "123 Maple Street, Anytown, USA",
  emergencyContacts: [
    {
      name: "John Johnson",
      relationship: "Son",
      phone: "(555) 123-4567",
      email: "john.johnson@example.com"
    }
  ],
  medicalConditions: "Hypertension, Type 2 Diabetes, Mild Arthritis",
  medications: [
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: "Morning",
      notes: "Take with food"
    },
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      timeOfDay: "Morning and evening",
      notes: "Take with meals"
    }
  ],
  allergies: "Penicillin, Shellfish",
  doctorInfo: "Dr. Sarah Smith - (555) 987-6543",
  notes: "Prefers to take medications with meals. Needs reminder for water intake throughout the day.",
  appointments: []
};

const ElderlyProfileContext = createContext<ElderlyProfileContextType | undefined>(undefined);

export const ElderlyProfileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<ElderlyProfile>(initialProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real application, you would save this to a database
    console.log("Saving profile:", profile);
    // Show success message
    toast({
      title: "Success",
      description: "Profile saved successfully!",
    });
  };

  const addMedication = (medication: Medication) => {
    setProfile(prev => ({
      ...prev,
      medications: [...prev.medications, medication]
    }));
    toast({
      title: "Medication Added",
      description: `${medication.name} has been added to the medications list.`,
    });
  };

  const removeMedication = (index: number) => {
    const medicationName = profile.medications[index].name;
    setProfile(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
    toast({
      title: "Medication Removed",
      description: `${medicationName} has been removed from the medications list.`,
    });
  };

  const addAppointment = (appointment: Appointment) => {
    setProfile(prev => ({
      ...prev,
      appointments: [...prev.appointments, appointment]
    }));
    toast({
      title: "Appointment Scheduled",
      description: `Appointment on ${new Date(appointment.date).toLocaleDateString()} has been scheduled.`,
    });
  };

  const removeAppointment = (id: string) => {
    setProfile(prev => ({
      ...prev,
      appointments: prev.appointments.filter(apt => apt.id !== id)
    }));
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled.",
    });
  };

  const addEmergencyContact = (contact: EmergencyContact) => {
    setProfile(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, contact]
    }));
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added as an emergency contact.`,
    });
  };

  const removeEmergencyContact = (index: number) => {
    const contactName = profile.emergencyContacts[index].name;
    setProfile(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
    toast({
      title: "Contact Removed",
      description: `${contactName} has been removed from emergency contacts.`,
    });
  };
  
  const triggerEmergencyAlert = () => {
    toast({
      title: "Emergency Alert Triggered",
      description: "Contacting emergency services and notifying emergency contacts.",
      variant: "destructive",
    });
    
    // In a real application, you would send SMS/call emergency contacts
    console.log("EMERGENCY ALERT: Contacting emergency services and notifying emergency contacts");
    console.log("Emergency contacts to notify:", profile.emergencyContacts);
    
    // Simulate calling emergency services
    setTimeout(() => {
      toast({
        title: "Emergency Services Notified",
        description: "Emergency services have been notified of your situation.",
        variant: "destructive",
      });
    }, 2000);
  };

  return (
    <ElderlyProfileContext.Provider value={{ 
      profile, 
      setProfile, 
      handleChange, 
      handleSave,
      addMedication,
      removeMedication,
      addAppointment,
      removeAppointment,
      addEmergencyContact,
      removeEmergencyContact,
      triggerEmergencyAlert
    }}>
      {children}
    </ElderlyProfileContext.Provider>
  );
};

export const useElderlyProfile = () => {
  const context = useContext(ElderlyProfileContext);
  if (context === undefined) {
    throw new Error("useElderlyProfile must be used within an ElderlyProfileProvider");
  }
  return context;
};
