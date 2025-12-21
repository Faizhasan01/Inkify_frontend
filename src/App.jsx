import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Account from "@/pages/account";
import ResetPassword from "@/pages/reset-password";
import { useAuth } from "@/hooks/useAuth";
import { createContext, useContext } from "react";
import Landing from "@/pages/landing";


export const AuthContext = createContext(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

function ProtectedHome() {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Landing/>;
  }
  
  return <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={ProtectedHome} />
      <Route path="/room/:roomId" component={ProtectedHome} />
      <Route path="/account" component={Account} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
