import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const token = params?.token;
  const { toast } = useToast();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token/${token}`);
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setIsValid(true);
        setEmail(data.email);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      setIsValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Password reset successful",
          description: "You can now log in with your new password.",
        });
      } else {
        toast({
          title: "Reset failed",
          description: data.error || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <XCircle className="w-16 h-16 text-destructive mx-auto" />
              <h2 className="text-2xl font-semibold">Invalid or Expired Link</h2>
              <p className="text-muted-foreground">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button onClick={() => setLocation("/account")} className="w-full">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-semibold">Password Reset Complete</h2>
              <p className="text-muted-foreground">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Button onClick={() => setLocation("/account")} className="w-full">
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 pattern-grid opacity-20" />
        
        <div className="relative w-96 h-96">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70"
          />
          <motion.div 
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70"
          />
        </div>
        
        <div className="relative z-10 text-center space-y-4 max-w-md p-8">
          <img src="/logo.png" alt="Inkify" className="w-24 h-24 mx-auto rounded-xl mb-4" />
          <h1 className="text-4xl font-display font-bold tracking-tight">
            Inkify
          </h1>
          <p className="text-muted-foreground text-lg">
            Reset your password and get back to creating.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-8">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                Enter a new password for {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="new-password" 
                      type="password" 
                      className="pl-9" 
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      className="pl-9" 
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
              <div className="text-center">
                <Button variant="link" onClick={() => setLocation("/account")}>
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
