
import { Link } from "react-router-dom";
import { Card, CardDescription } from "@/components/ui/card";

const LogoSection = () => {
  return (
    <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-10 bg-sidebar text-sidebar-foreground">
      <Link to="/" className="mb-8">
        <div className="flex items-center gap-2">
          <div className="size-12 rounded-lg bg-primary/80 flex items-center justify-center">
            <span className="font-bold text-2xl">V</span>
          </div>
          <span className="font-bold text-2xl">VendorHub</span>
        </div>
      </Link>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Vendor Dashboard</h1>
        <p className="text-xl font-light max-w-md">
          Manage your business, track sales, and grow your customer base all in one place.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {[
          { title: "Sales Tracking", description: "Monitor your daily, weekly and monthly sales performance" },
          { title: "Customer Management", description: "Keep track of customer information and purchase history" },
          { title: "Inventory Control", description: "Manage stock levels and get low inventory alerts" },
          { title: "Advanced Analytics", description: "Gain insights into trends with detailed reports" }
        ].map((feature, index) => (
          <Card key={index} className="bg-sidebar-accent text-sidebar-accent-foreground p-4">
            <h3 className="font-semibold">{feature.title}</h3>
            <CardDescription className="text-sidebar-accent-foreground/80">
              {feature.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LogoSection;
