import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import LogoSection from "@/components/auth/LogoSection";
import { supabase } from "@/integrations/supabase/client";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [optional1, setOptional1] = useState("");
  const [optional2, setOptional2] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Terms and Conditions",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!documentFile) {
      toast({
        title: "Document Required",
        description: "Please upload your vendor document to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed");

      const userId = authData.user.id;

      // 2. Upload document to storage
      const fileExt = documentFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vendor-documents')
        .upload(filePath, documentFile);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: publicURLData } = supabase.storage
        .from('vendor-documents')
        .getPublicUrl(filePath);

      const fileUrl = publicURLData.publicUrl;

      // 3. Insert user data to the user table
      const { error: profileError } = await supabase
        .from('user')
        .insert([
          {
            user_id: userId,
            name: fullName,
            email: email,
            phone: phone,
            file_Url: fileUrl,
            user_role: 'vendor',
            signin_type: 'email',
            Onboarding_step: null, // Empty as specified
            Approved: 'Waiting', // Default to Waiting as specified
            optional_1: optional1 || null,
            optional_2: optional2 || null
          }
        ]);

      if (profileError) throw profileError;

      toast({
        title: "Account created",
        description: "Your account has been created and is pending approval.",
      });

      // Navigate to waiting for approval page
      navigate("/waiting-approval");
      
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LogoSection />
      
      <div className="flex flex-1 items-center justify-center p-6 bg-muted/30">
        <Card className="w-full max-w-md shadow-lg animate-fadeIn">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Create a vendor account</CardTitle>
            <CardDescription>
              Enter your details to get started with VendorHub
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <Input 
                    id="fullName"
                    type="text" 
                    placeholder="John Doe"
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </span>
                  <Input 
                    id="phone"
                    type="tel" 
                    placeholder="+1 123 456 7890"
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">Vendor Document</Label>
                <div className="relative">
                  <Input 
                    id="document"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    required
                    className="cursor-pointer"
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    Please upload a business license or other relevant document
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="optional1">Optional 1</Label>
                <Input
                  id="optional1"
                  type="text"
                  placeholder="Optional 1 (optional)"
                  className="pl-3"
                  value={optional1}
                  onChange={(e) => setOptional1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="optional2">Optional 2</Label>
                <Input
                  id="optional2"
                  type="text"
                  placeholder="Optional 2 (optional)"
                  className="pl-3"
                  value={optional2}
                  onChange={(e) => setOptional2(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms}
                  onCheckedChange={(checked) => {
                    setAgreeTerms(checked as boolean);
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full hero-gradient" 
                disabled={isLoading || !agreeTerms}
              >
                {isLoading ? "Creating account..." : "Create vendor account"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
