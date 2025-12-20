import { useState, useEffect } from "react";
import { useLocation, useParams} from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CheckCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/lib/api";

const API_URL = getApiUrl(); 


export default function ResetPassword() {
  const { toast } = useToast();

  const [, setLocation] = useLocation()
  
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

    const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep("otp");
        toast({
          title: "OTP sent",
          description: "Check your email for a 6-digit code.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send OTP.",
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

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setStep("password");
        toast({
          title: "OTP verified",
          description: "Now set your new password.",
        });
      } else {
        toast({
          title: "Invalid OTP",
          description: data.error || "The code is invalid or expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
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
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
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
            {step === "email" && (
              <>
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl">Reset Password</CardTitle>
                  <CardDescription>
                    Enter your email to receive a verification code
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleRequestOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          className="pl-9" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Code"}
                    </Button>
                  </form>
                  <div className="text-center mt-4">
                    <Button variant="link" onClick={() => setLocation("/account")}>
                      Back to Login
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === "otp" && (
              <>
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl">Verify Code</CardTitle>
                  <CardDescription>
                    Enter the 6-digit code sent to {email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input 
                        id="otp" 
                        type="text" 
                        maxLength="6"
                        className="text-center text-2xl tracking-widest font-mono"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                      />
                      <p className="text-xs text-muted-foreground">
                        Code expires in 10 minutes
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting || otp.length !== 6}>
                      {isSubmitting ? "Verifying..." : "Verify Code"}
                    </Button>
                  </form>
                  <div className="text-center mt-4 space-y-2">
                    <Button variant="link" onClick={() => setStep("email")} className="w-full text-xs">
                      Try different email
                    </Button>
                    <Button variant="link" onClick={() => setLocation("/account")}>
                      Back to Login
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === "password" && (
              <>
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl">Set New Password</CardTitle>
                  <CardDescription>
                    Enter your new password for {email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleResetPassword} className="space-y-4">
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
                  <div className="text-center mt-4">
                    <Button variant="link" onClick={() => setLocation("/account")}>
                      Back to Login
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
