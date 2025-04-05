
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const { forgotPassword, loading } = useAuth();

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await forgotPassword(email);
      setEmailSent(true);
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
          {emailSent 
            ? "Check your email for reset instructions" 
            : "Enter your email to receive a password reset link"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${error ? "border-destructive" : ""}`}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-medical-600 hover:bg-medical-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-3 bg-medical-50 text-medical-700 rounded-md">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Didn't receive an email? Check your spam folder or try again with a different email.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link to="/login" className="text-sm text-primary flex items-center hover:underline">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
