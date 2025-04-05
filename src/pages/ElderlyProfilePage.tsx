
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { HeartPulse, ArrowLeft, UserRound, Wheelchair, Calendar, Clock } from "lucide-react";

const ElderlyProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // In a real application, you would fetch this data from a database
  const [profile, setProfile] = React.useState({
    name: "Elizabeth Johnson",
    age: 78,
    address: "123 Maple Street, Anytown, USA",
    emergencyContact: "John Johnson (Son) - (555) 123-4567",
    medicalConditions: "Hypertension, Type 2 Diabetes, Mild Arthritis",
    medications: "Lisinopril 10mg (morning), Metformin 500mg (morning and evening), Acetaminophen as needed for pain",
    allergies: "Penicillin, Shellfish",
    doctorInfo: "Dr. Sarah Smith - (555) 987-6543",
    notes: "Prefers to take medications with meals. Needs reminder for water intake throughout the day."
  });

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <HeartPulse className="h-8 w-8 text-medical-600 mr-2" />
            <h1 className="text-xl font-bold text-medical-900">MediRemind</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {user?.name || user?.email}
            </span>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')} 
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-medical-100 p-3 rounded-full">
            <UserRound className="h-12 w-12 text-medical-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Elderly Profile</h1>
            <p className="text-gray-600">Manage health information for your loved one</p>
          </div>
        </div>
        
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
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wheelchair className="h-5 w-5 text-medical-600 mr-2" />
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
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-medical-600 mr-2" />
              Notes & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" name="notes" value={profile.notes} onChange={handleChange} className="min-h-[120px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} className="bg-medical-600 hover:bg-medical-700">
              Save Profile
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-medical-600 mr-2" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No upcoming appointments scheduled.</p>
            <Button variant="outline" className="mt-4">
              Schedule New Appointment
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ElderlyProfilePage;
