
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { Activity, PlusCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const MedicalInfoPage = () => {
  const { profile, handleChange, addMedication, removeMedication } = useElderlyProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      timeOfDay: "",
      notes: ""
    },
  });

  const onSubmit = (values: any) => {
    addMedication(values);
    form.reset();
    setIsDialogOpen(false);
  };
  
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
          <div className="flex justify-between items-center mb-2">
            <Label>Medications</Label>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Medication Name</Label>
                    <Input id="name" {...form.register("name", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input id="dosage" {...form.register("dosage", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input id="frequency" {...form.register("frequency", { required: true })} placeholder="e.g., Once daily, Twice daily" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeOfDay">Time of Day</Label>
                    <Input id="timeOfDay" {...form.register("timeOfDay", { required: true })} placeholder="e.g., Morning, Evening" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" {...form.register("notes")} placeholder="Optional notes" />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Add Medication</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {profile.medications.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No medications added yet.</p>
          ) : (
            <div className="space-y-2">
              {profile.medications.map((medication, index) => (
                <div key={index} className="border rounded-md p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{medication.name} - {medication.dosage}</h4>
                      <p className="text-sm text-gray-600">{medication.frequency}, {medication.timeOfDay}</p>
                      {medication.notes && <p className="text-sm text-gray-500 mt-1">Note: {medication.notes}</p>}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMedication(index)}
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
