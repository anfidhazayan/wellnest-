
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const AppointmentsPage = () => {
  return (
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
  );
};

export default AppointmentsPage;
