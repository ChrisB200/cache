import { DndContext } from "@dnd-kit/core";
import BankAccountSidebar from "./BankCardSidebar";
import { CardsProvider } from "@/contexts/CardContext";
import { SidebarProvider } from "@/components/ui/sidebar";

function Banking() {
  return (
    <div>
      <CardsProvider>
        <SidebarProvider>
          <DndContext>
            <BankAccountSidebar />
          </DndContext>
        </SidebarProvider>
      </CardsProvider>
    </div>
  );
}

export default Banking;
