
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, PlusCircle, XCircle } from "lucide-react";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

const AppointmentsPage = () => {
  const { profile, addAppointment, removeAppointment } = useElderlyProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  
  const form = useForm({
    defaultValues: {
      title: "",
      time: "",
      doctor: "",
      location: "",
      notes: ""
    }
  });

  const handleAddAppointment = (values: any) => {
    if (!date) return;
    
    const appointment = {
      id: uuidv4(),
      date: date.toISOString(),
      ...values
    };
    
    addAppointment(appointment);
    form.reset();
    setDate(undefined);
    setIsDialogOpen(false);
  };

  const formatAppointmentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "PPP");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-medical-600 mr-2" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {profile.appointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments scheduled.</p>
        ) : (
          <div className="space-y-4">
            {profile.appointments
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(appointment => (
                <div key={appointment.id} className="border rounded-md p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.title}</h4>
                      <div className="text-sm text-gray-600 space-y-1 mt-1">
                        <p>📅 {formatAppointmentDate(appointment.date)} at {appointment.time}</p>
                        <p>👨‍⚕️ {appointment.doctor}</p>
                        <p>📍 {appointment.location}</p>
                        {appointment.notes && <p className="text-gray-500 mt-1">{appointment.notes}</p>}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeAppointment(appointment.id)}
                      className="text-red-500 h-8 w-8 p-0"
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4 flex gap-2">
              <PlusCircle className="h-4 w-4" />
              Schedule New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleAddAppointment)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="title">Appointment Title</Label>
                <Input id="title" {...form.register("title", { required: true })} placeholder="e.g., Regular Checkup" />
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" {...form.register("time", { required: true })} placeholder="e.g., 10:00 AM" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Input id="doctor" {...form.register("doctor", { required: true })} placeholder="e.g., Dr. Sarah Smith" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location", { required: true })} placeholder="e.g., Memorial Hospital" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...form.register("notes")} placeholder="Optional notes" />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={!date}>Schedule Appointment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AppointmentsPage;
