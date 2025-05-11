import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      // Check session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        navigate("/login");
        return;
      }
      // Fetch user data
      const { data: userData, error } = await supabase
        .from("user")
        .select("user_role, Approved")
        .eq("user_id", session.user.id)
        .single();
      if (error || !userData) {
        navigate("/login");
        return;
      }
      if (userData.Approved !== "Accepted") {
        navigate("/waiting-approval");
        return;
      }
      if (userData.user_role !== "vendor") {
        navigate("/not-authorized");
        return;
      }
      setIsAllowed(true);
      setIsLoading(false);
    };
    checkAuthAndRole();
    // eslint-disable-next-line
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{isAllowed && children}</>;
};

export default ProtectedRoute; 