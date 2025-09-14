import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import WorkCalendar from "./WorkCalendar";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useDate } from "./DateContext";
import { Button } from "@/components/ui/button";
import WorkEvents from "./WorkEvents";

function WorkSidebar() {
  const { getMonthName, getYear, prevMonth, nextMonth } = useDate();

  return (
    <>
      <SidebarTrigger>
        <Calendar />
      </SidebarTrigger>

      <Sidebar side="right" collapsible="offcanvas">
        <div className="px-8">
          <SidebarHeader>
            <p className="text-center text-muted-foreground">{getYear()}</p>
            <div className="flex justify-between align-top">
              <Button variant="ghost" onClick={prevMonth}>
                <ChevronLeft />
              </Button>
              <p className="text-2xl font-bold">{getMonthName()}</p>
              <Button variant="ghost" onClick={nextMonth}>
                <ChevronRight />
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <WorkCalendar />
            </SidebarGroup>
            <SidebarGroup>
              <WorkEvents />
            </SidebarGroup>
          </SidebarContent>
        </div>
      </Sidebar>
    </>
  );
}

export default WorkSidebar;
