
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { TopNav } from "@/components/dashboard/TopNav";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-muted/30">
      <SidebarNav open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
