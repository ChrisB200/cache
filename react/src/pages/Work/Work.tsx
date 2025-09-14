import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import WorkSidebar from "./WorkSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar } from "lucide-react";

function Work() {
  return (
    <div>
      <Button asChild>
        <Link to="/profile/setup">Setup account details</Link>
      </Button>
      <SidebarProvider
        style={{
          "--sidebar-width": "25rem",
        }}
      >
        <WorkSidebar />
      </SidebarProvider>
    </div>
  );
}

export default Work;
