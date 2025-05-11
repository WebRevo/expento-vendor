
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthProviderProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthProvider = ({ 
  children, 
  requireAuth = true,
  redirectTo = "/login" 
}: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setIsLoading(false);
        
        if (requireAuth && !currentSession) {
          navigate(redirectTo);
        }
      }
    );

    // Then check the current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsLoading(false);
      
      if (requireAuth && !currentSession) {
        navigate(redirectTo);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth, redirectTo]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
