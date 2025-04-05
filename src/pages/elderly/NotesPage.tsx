
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { Clock } from "lucide-react";

const NotesPage = () => {
  const { profile, handleChange, handleSave } = useElderlyProfile();
  
  return (
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
  );
};

export default NotesPage;
