
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { UserRound } from "lucide-react";

const PersonalInfoPage = () => {
  const { profile, handleChange } = useElderlyProfile();
  
  return (
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
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input id="emergencyContact" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoPage;
