
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarNavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SidebarNav({ open, setOpen }: SidebarNavProps) {
  const location = useLocation();
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
    }
  ];

  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen overflow-y-auto transition-all duration-300 ease-in-out border-r border-sidebar-border fixed lg:relative z-10",
        open ? "w-64" : "w-0 lg:w-20"
      )}
    >
      <div className={cn("p-6", !open && "lg:p-3")}>
        <div className="flex items-center justify-between mb-8">
          {open ? (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="size-10 rounded-lg bg-primary/80 flex items-center justify-center">
                <span className="font-bold text-xl">V</span>
              </div>
              <h2 className="font-bold text-xl">VendorHub</h2>
            </Link>
          ) : (
            <Link to="/dashboard" className="w-full flex justify-center">
              <div className="size-10 rounded-lg bg-primary/80 flex items-center justify-center">
                <span className="font-bold text-xl">V</span>
              </div>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="hidden lg:flex hover:bg-sidebar-accent"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", !open && "rotate-180")} />
          </Button>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center py-3 px-4 rounded-lg transition-colors",
                location.pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                !open && "lg:justify-center lg:px-2"
              )}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {open && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
