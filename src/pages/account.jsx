import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Mail, Lock, User, Copy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";

export default function Account() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, login, register } = useAuthContext();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetLinkGenerated, setResetLinkGenerated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSendingReset(true);
    setResetLinkGenerated(null);
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok && data.resetToken) {
        const resetUrl = `${window.location.origin}/reset-password/${data.resetToken}`;
        setResetLinkGenerated(resetUrl);
        toast({
          title: "Reset link generated",
          description: "Copy the link below to reset your password.",
        });
      } else if (response.ok) {
        toast({
          title: "Request processed",
          description: data.message || "If the email exists, a reset link has been generated.",
        });
        setShowForgotPassword(false);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process request.",
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
      setIsSendingReset(false);
    }
  };

  const copyResetLink = () => {
    if (resetLinkGenerated) {
      navigator.clipboard.writeText(resetLinkGenerated);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Reset link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await register(signupEmail, signupPassword, signupName);
      toast({
        title: "Account created!",
        description: "Welcome to Inkify. Start creating!",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70"
          />
        </div>
        
        <div className="relative z-10 text-center space-y-4 max-w-md p-8">
          <img src="/logo.png" alt="Inkify" className="w-24 h-24 mx-auto rounded-xl mb-4" />
          <h1 className="text-4xl font-display font-bold tracking-tight">
            Inkify
          </h1>
          <p className="text-muted-foreground text-lg">
            Where ideas take shape. Join the collaborative workspace for creative teams.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl">Welcome backkkkkkk</CardTitle>
                  <CardDescription>
                    Enter your email to sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          placeholder="name@example.com" 
                          type="email" 
                          className="pl-9" 
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type="password" 
                          className="pl-9" 
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                  <div className="text-center pt-2">
                    <Button 
                      variant="link" 
                      className="text-sm text-muted-foreground"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot your password?
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl">Create an account</CardTitle>
                  <CardDescription>
                    Enter your details to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          className="pl-9" 
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-email" 
                          placeholder="name@example.com" 
                          type="email" 
                          className="pl-9" 
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="signup-password" 
                          type="password" 
                          className="pl-9" 
                          required
                          minLength={6}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showForgotPassword} onOpenChange={(open) => {
        setShowForgotPassword(open);
        if (!open) {
          setResetLinkGenerated(null);
          setForgotEmail("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll generate a reset link for you.
            </DialogDescription>
          </DialogHeader>
          
          {!resetLinkGenerated ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="forgot-email" 
                    placeholder="name@example.com" 
                    type="email" 
                    className="pl-9" 
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSendingReset}>
                  {isSendingReset ? "Generating..." : "Get Reset Link"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Reset link generated!</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy this link and open it in a new tab to reset your password. The link expires in 1 hour.
                </p>
                <div className="flex gap-2">
                  <Input 
                    value={resetLinkGenerated} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button 
                    type="button" 
                    size="icon"
                    onClick={copyResetLink}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetLinkGenerated(null);
                  setForgotEmail("");
                }}
                className="w-full"
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
