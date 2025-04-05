
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Bell, Calendar, PlusCircle, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back{user?.name ? `, ${user.name}` : ''}!</h2>
          <p className="text-gray-600">Here's your health dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Bell className="h-5 w-5 text-medical-600 mr-2" />
                Medication Reminders
              </CardTitle>
              <CardDescription>Keep track of your medications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">No active reminders</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full text-sm" variant="outline">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Medication
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Calendar className="h-5 w-5 text-medical-600 mr-2" />
                Appointments
              </CardTitle>
              <CardDescription>Upcoming doctor visits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">No upcoming appointments</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full text-sm" variant="outline">
                <PlusCircle className="h-4 w-4 mr-1" />
                Schedule Appointment
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <HeartPulse className="h-5 w-5 text-medical-600 mr-2" />
                Health Metrics
              </CardTitle>
              <CardDescription>Track your health data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">No health data recorded</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full text-sm" variant="outline">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Health Data
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
