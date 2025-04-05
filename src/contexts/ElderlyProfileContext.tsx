
import React, { createContext, useContext, useState } from "react";

type ElderlyProfile = {
  name: string;
  age: number;
  address: string;
  emergencyContact: string;
  medicalConditions: string;
  medications: string;
  allergies: string;
  doctorInfo: string;
  notes: string;
};

type ElderlyProfileContextType = {
  profile: ElderlyProfile;
  setProfile: React.Dispatch<React.SetStateAction<ElderlyProfile>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSave: () => void;
};

const initialProfile = {
  name: "Elizabeth Johnson",
  age: 78,
  address: "123 Maple Street, Anytown, USA",
  emergencyContact: "John Johnson (Son) - (555) 123-4567",
  medicalConditions: "Hypertension, Type 2 Diabetes, Mild Arthritis",
  medications: "Lisinopril 10mg (morning), Metformin 500mg (morning and evening), Acetaminophen as needed for pain",
  allergies: "Penicillin, Shellfish",
  doctorInfo: "Dr. Sarah Smith - (555) 987-6543",
  notes: "Prefers to take medications with meals. Needs reminder for water intake throughout the day."
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
    alert("Profile saved successfully!");
  };

  return (
    <ElderlyProfileContext.Provider value={{ profile, setProfile, handleChange, handleSave }}>
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
