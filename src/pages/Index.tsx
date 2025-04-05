
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeartPulse, Bell, Calendar, Microscope } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-blue-50">
      {/* Hero Section */}
      <header className="p-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <HeartPulse className="h-8 w-8 text-medical-600 mr-2" />
            <span className="text-xl font-bold text-medical-900">MediRemind</span>
          </div>
          <div className="space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-medical-600 hover:bg-medical-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center md:space-x-12">
          <div className="md:w-1/2 space-y-6 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-medical-900 leading-tight">
              Your Personal Health Assistant
            </h1>
            <p className="text-xl text-gray-700">
              MediRemind helps you stay on top of your health with medication reminders, appointment alerts, and emergency assistance.
            </p>
            <div className="flex space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-medical-600 hover:bg-medical-700">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-medical-50 p-6 rounded-lg border border-medical-100">
                <Bell className="h-10 w-10 text-medical-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Medication Reminders</h3>
                <p className="text-gray-600">Never miss a dose with timely reminders for all your medications.</p>
              </div>
              <div className="bg-medical-50 p-6 rounded-lg border border-medical-100">
                <Calendar className="h-10 w-10 text-medical-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Appointment Alerts</h3>
                <p className="text-gray-600">Keep track of upcoming doctor appointments and health check-ups.</p>
              </div>
              <div className="bg-medical-50 p-6 rounded-lg border border-medical-100 col-span-1 md:col-span-2">
                <Microscope className="h-10 w-10 text-medical-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Emergency Help</h3>
                <p className="text-gray-600">In case of emergency, activate help with voice commands to alert your emergency contacts.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
