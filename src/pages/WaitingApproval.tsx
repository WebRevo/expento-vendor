
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const WaitingApproval = () => {
  const [approvalStatus, setApprovalStatus] = useState<string | null>("Waiting");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      // Fetch user approval status
      const { data, error } = await supabase
        .from('user')
        .select('Approved')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching approval status:", error);
        return;
      }
      
      setApprovalStatus(data.Approved);
      
      // If approved, redirect to dashboard
      if (data.Approved === 'Accepted') {
        navigate("/dashboard");
      }
    };
    
    checkAuth();
    
    // Set up a periodic check for status updates
    const intervalId = setInterval(checkAuth, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [navigate]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Account Approval Status</CardTitle>
          <CardDescription className="text-center">
            Your vendor account is being reviewed by Admin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6">
            {approvalStatus === 'Waiting' && (
              <>
                <Clock className="h-20 w-20 text-amber-500 mb-4" />
                <h3 className="text-xl font-medium text-center">Waiting for Approval</h3>
              </>
            )}
            
            {approvalStatus === 'Rejected' && (
              <>
                <XCircle className="h-20 w-20 text-destructive mb-4" />
                <h3 className="text-xl font-medium text-center">Application Rejected</h3>
                <p className="text-center text-muted-foreground mt-2">
                  Unfortunately, your vendor application has been rejected. Please contact our support team for more information.
                </p>
              </>
            )}
            
            {approvalStatus === 'Accepted' && (
              <>
                <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-center">Application Approved!</h3>
                <p className="text-center text-muted-foreground mt-2">
                  Congratulations! Your vendor account has been approved. You can now access the dashboard.
                </p>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {approvalStatus === 'Accepted' && (
            <Button 
              className="w-full hero-gradient" 
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WaitingApproval;
