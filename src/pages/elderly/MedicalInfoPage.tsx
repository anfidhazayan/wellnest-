
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { Activity } from "lucide-react";

const MedicalInfoPage = () => {
  const { profile, handleChange } = useElderlyProfile();
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 text-medical-600 mr-2" />
          Medical Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="medicalConditions">Medical Conditions</Label>
          <Textarea id="medicalConditions" name="medicalConditions" value={profile.medicalConditions} onChange={handleChange} className="min-h-[80px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medications">Medications</Label>
          <Textarea id="medications" name="medications" value={profile.medications} onChange={handleChange} className="min-h-[100px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Input id="allergies" name="allergies" value={profile.allergies} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="doctorInfo">Doctor Information</Label>
          <Input id="doctorInfo" name="doctorInfo" value={profile.doctorInfo} onChange={handleChange} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalInfoPage;
