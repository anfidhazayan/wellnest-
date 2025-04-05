
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { FileText } from "lucide-react";
import EmergencyAlertHistory from "@/components/emergency/EmergencyAlertHistory";

const NotesPage = () => {
  const { profile, handleChange, handleSave } = useElderlyProfile();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 text-medical-600 mr-2" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              name="notes"
              value={profile.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes about the elderly person..."
              className="min-h-[200px]"
            />
            <Button onClick={handleSave}>Save Notes</Button>
          </div>
        </CardContent>
      </Card>
      
      <EmergencyAlertHistory />
    </div>
  );
};

export default NotesPage;
