
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);
  const [errors, setErrors] = useState<{ 
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token') || '';

  const validateForm = () => {
    const newErrors: { 
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await resetPassword(token, password);
      setResetComplete(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Error is handled by the auth context
      console.error("Password reset error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-medical-100">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          {resetComplete 
            ? "Your password has been reset successfully" 
            : "Enter your new password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!resetComplete ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-medical-600 hover:bg-medical-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-3 bg-green-50 text-green-700 rounded-md">
              Password reset successful! Redirecting to login...
            </div>
          </div>
        )}
      </CardContent>
      {!resetComplete && (
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-primary flex items-center hover:underline">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Sign In
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
