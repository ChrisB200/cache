import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DisplayError } from "@/types/errors";
import { useEffect, useState, type FormEvent } from "react";
import { Button, buttonVariants } from "./ui/button";
import FormButtons from "./ui/form/FormButtons";
import type { FormButtonProps } from "@/types/form";

export interface DialogProps {
  error: DisplayError | null;
  setError: any;
}

// Utility to flatten nested button arrays
function flattenButtons(
  buttons: (FormButtonProps | FormButtonProps[])[]
): FormButtonProps[] {
  return buttons.flatMap((b) => (Array.isArray(b) ? flattenButtons(b) : b));
}

function wrapButtons(
  buttons: (FormButtonProps | FormButtonProps[])[],
  closeDialog: () => void
): FormButtonProps[] {
  return flattenButtons(buttons).map((b) => ({
    ...b,
    onClick: (e) => {
      b.onClick?.(e);
      closeDialog();
    },
  }));
}

function ErrorAlertDialog({ error, setError }: DialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    } else {
      return;
    }
  }, [error]);

  if (!error) return;

  const closeDialog = () => {
    setOpen(false);
    setError(null);
  };

  const wrapped = error.buttons ? wrapButtons(error.buttons, closeDialog) : [];

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="border-destructive ">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {error.title || "An error has occured"}
          </AlertDialogTitle>
          <AlertDialogDescription>{error.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {wrapped.length === 0 ? (
            <Button onClick={closeDialog}>Try Again</Button>
          ) : (
            <FormButtons buttons={wrapped} />
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ErrorAlertDialog;
