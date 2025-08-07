import Form from "@/components/ui/form/Form";
import type { ButtonGroup, FieldGroup } from "@/types/form";
import { useCards } from "@/contexts/CardContext";
import useForm from "@/hooks/useForm";
import { updateBankNickname } from "@/services/bankingService";
import type { BankAccount } from "@/types/banking";
import { useEffect, useState } from "react";
import { z } from "zod";

const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(3, "Nickname must be at least 3 characters")
    .max(30, "Nickname must be less than 30 characters"),
});

interface NicknameDialogProps {
  open: boolean;
  setOpen: any;
  card: BankAccount;
}

function NicknameDialog({ setOpen, open, card }: NicknameDialogProps) {
  const [loading, setLoading] = useState(false);
  const { refetch } = useCards();
  const { values, setError } = useForm("change-nickname", {
    nickname: card.nickname ? card.nickname : card.name,
  });

  useEffect(() => {
    values.nickname = card.nickname ? card.nickname : card.name;
  }, [open]);

  const update = async (nickname: string) => {
    setLoading(true);
    const response = await updateBankNickname(card.id, nickname);
    if (response === "success") {
      setLoading(false);
      setOpen(false);
      refetch();
    } else {
      setError(response);
    }
  };

  const handleSubmit = async () => {
    await update(values.nickname);
  };

  const handleReset = async () => {
    await update(card.name);
  };

  const fields: FieldGroup[] = [
    {
      element: "input",
      name: "nickname",
      placeholder: "New Nickname",
      required: true,
      label: "Nickname",
    },
  ];

  const buttons: ButtonGroup[] = [
    [
      {
        text: "Reset",
        type: "button",
        variant: "outline",
        onClick: handleReset,
      },
      {
        text: "Submit",
        type: "submit",
        variant: "accent",
      },
    ],
  ];

  return (
    <Form
      variant="dialog"
      open={open}
      setOpen={setOpen}
      name="change-nickname"
      title="Change Nickname"
      description="Change your nickname for a specific bank account"
      fields={fields}
      buttons={buttons}
      handleSubmit={handleSubmit}
      schema={nicknameSchema}
    />
  );
}

export default NicknameDialog;
