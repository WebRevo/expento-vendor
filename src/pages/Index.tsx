
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app with authentication, we would check if the user is logged in
    // For now, we'll just show links to login/dashboard
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="size-16 rounded-lg bg-primary/80 flex items-center justify-center">
            <span className="font-bold text-3xl text-primary-foreground">V</span>
          </div>
          <h1 className="text-4xl font-bold">VendorHub</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Powerful dashboard for vendors to manage sales, inventory, and customers
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={() => navigate("/login")} className="hero-gradient">
          Login
        </Button>
        <Button onClick={() => navigate("/signup")} variant="outline">
          Create Account
        </Button>
      </div>
      
      {/* Supabase notice */}
      <div className="mt-12 p-4 border rounded-lg bg-muted/50 max-w-md text-center">
        <h2 className="font-medium mb-2">Connect to Supabase</h2>
        <p className="text-sm text-muted-foreground mb-4">
          To enable authentication and backend features, please connect your project to Supabase
          using the green Supabase button in the top right corner.
        </p>
      </div>
    </div>
  );
};

export default Index;
