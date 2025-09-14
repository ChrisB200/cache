import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { BankAccount } from "@/types/banking";
import BankCardDropdown from "./BankCardDropdown";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCards } from "@/contexts/CardContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Grip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLink } from "@/contexts/LinkContext";
import { getImage } from "@/utils/image";
import { formatInstitutionName } from "@/utils/text";

function BankCard({ bankAccount }: { bankAccount: BankAccount }) {
  const { toggleSelectedCard, selectedCardsIds } = useCards();
  const { generateToken } = useLink();
  const [isSelected, setIsSelected] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: bankAccount.id,
      data: bankAccount,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (selectedCardsIds.indexOf(bankAccount.id) !== -1) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedCardsIds]);

  const handleClick = () => {
    toggleSelectedCard(bankAccount.id);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={cn(
        "bg-primary-subtle flex flex-col justify-between h-[260px] z-2",
        "hover:cursor-pointer transition-colors",
        isSelected ? "border-accent/40" : "",
        bankAccount.expired ? "border-destructive" : "",
      )}
    >
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12">
              <img
                className="size-full"
                src={getImage(bankAccount.institution.logoUrl)}
              />
            </div>
            <p>{formatInstitutionName(bankAccount.institution.name)}</p>
          </div>
          <Grip size={20} />
        </CardDescription>
      </CardHeader>
      <CardContent className="font-bold">
        <div className="flex gap-5 justify-between ">
          <p className="overflow-hidden overflow-ellipsis text-2xl">
            {bankAccount.nickname
              ? bankAccount.nickname.toUpperCase()
              : bankAccount.name.toUpperCase()}
          </p>
          <div>
            <div className="text-accent relative">
              <p className="absolute bottom-8 right-0 text-sm text-muted-foreground">
                BALANCE
              </p>
              <p className="text-2xl">£{bankAccount.balance}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent className="flex justify-between">
        {bankAccount.expired ? (
          <Button
            variant="destructive"
            onClick={() => generateToken(bankAccount.accessToken)}
          >
            Fix
          </Button>
        ) : (
          <BankCardDropdown card={bankAccount} />
        )}
      </CardContent>
    </Card>
  );
}

export default BankCard;
