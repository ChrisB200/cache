import type { FormEvent, ReactNode } from "react";
import type { ButtonGroup, FieldGroup, FormButtonProps } from "@/types/form";
import { Button } from "../button";
import type { ZodType } from "zod";
import useForm from "@/hooks/useForm";
import FormFields from "./FormFields";
import FormButtons from "./FormButtons";

interface FormContentProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  secondaryButton?: FormButtonProps;
  showSeparator?: boolean;
  name: string;
  buttons: ButtonGroup[];
  fields: FieldGroup[];
  bottomText?: ReactNode;
  schema?: ZodType<any, any, any>;
}

function FormContent({
  handleSubmit,
  secondaryButton,
  showSeparator,
  name,
  buttons,
  fields,
  bottomText,
  schema,
}: FormContentProps) {
  const { validate } = useForm(name);

  const handleInnerSubmit = (
    e: FormEvent<HTMLFormElement>,
    submitFn: (e: FormEvent<HTMLFormElement>) => void
  ) => {
    e.preventDefault();
    const isValid = schema ? validate(schema) : true;

    if (isValid && typeof submitFn === "function") {
      submitFn(e);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handleInnerSubmit(e, handleSubmit)}>
        <div className="flex flex-col gap-6">
          {/* Secondary Button (e.g. Google) at top */}
          {secondaryButton && (
            <>
              <Button
                type={secondaryButton.type || "button"}
                variant={secondaryButton.variant || "outline"}
                onClick={secondaryButton.onClick}
                disabled={secondaryButton.disabled}
                className="w-full flex items-center justify-center gap-2"
              >
                {secondaryButton.icon}
                {secondaryButton.text}
              </Button>
              {showSeparator && (
                <div className="relative my-4">
                  <div className="border-t border-gray-300 dark:border-gray-600" />
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
  bg-white dark:bg-card px-2 text-gray-500 dark:text-gray-400 text-sm select-none"
                  >
                    OR
                  </span>
                </div>
              )}
            </>
          )}

          {/* Fields */}
          <FormFields name={name} fields={fields} />

          {/* Primary Button */}
          <div className="flex flex-col gap-3">
            <FormButtons buttons={buttons} />
          </div>
        </div>

        {/* Bottom Text/Footer */}
        {bottomText && (
          <div className="mt-4 text-center text-sm dark:text-muted-foreground">
            {bottomText}
          </div>
        )}
      </form>
    </>
  );
}

export default FormContent;
