
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function ResetPasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-medical-50 to-blue-50 p-4">
      <div className="w-full max-w-md mb-6 flex flex-col items-center">
        <div className="mb-2 p-2 bg-white rounded-full shadow-sm">
          <HeartPulse className="h-10 w-10 text-medical-600" />
        </div>
        <h1 className="text-3xl font-bold text-medical-900">MediRemind</h1>
        <p className="text-medical-600">Your Personal Health Assistant</p>
      </div>
      
      <ResetPasswordForm />
    </div>
  );
}
