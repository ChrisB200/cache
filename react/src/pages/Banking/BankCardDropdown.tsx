import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import NicknameDialog from "./NicknameDialog";
import type { BankAccount } from "@/types/banking";
import { useLink } from "@/contexts/LinkContext";

function BankCardDropdown({ card }: { card: BankAccount }) {
  const { generateToken } = useLink();
  const [nicknameOpen, setNicknameOpen] = useState(false);

  return (
    <>
      <DropdownMenu data-no-dnd="true">
        <DropdownMenuTrigger asChild>
          <Button variant="outline">More</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setNicknameOpen(true)}>
            Change Nickname
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => generateToken(card.accessToken)}>
            Manage
          </DropdownMenuItem>
        </DropdownMenuContent>
        <NicknameDialog
          open={nicknameOpen}
          setOpen={setNicknameOpen}
          card={card}
        />
      </DropdownMenu>
    </>
  );
}

export default BankCardDropdown;
