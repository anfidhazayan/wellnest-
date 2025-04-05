
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { HeartPulse, ArrowLeft, UserRound, Activity, Calendar, Clock } from "lucide-react";

const ElderlyProfileLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
        
        <div className="flex mb-6 space-x-2 border-b">
          <Link to="/elderly-profile/personal">
            <Button variant="ghost" className="flex items-center">
              <UserRound className="h-4 w-4 mr-2" />
              Personal
            </Button>
          </Link>
          <Link to="/elderly-profile/medical">
            <Button variant="ghost" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Medical
            </Button>
          </Link>
          <Link to="/elderly-profile/notes">
            <Button variant="ghost" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Notes
            </Button>
          </Link>
          <Link to="/elderly-profile/appointments">
            <Button variant="ghost" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </Button>
          </Link>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
};

export default ElderlyProfileLayout;
