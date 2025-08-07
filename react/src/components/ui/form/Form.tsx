import useForm from "@/hooks/useForm";
import type { FormProps } from "@/types/form";
import FormDialog from "./FormDialog";
import FormCard from "./FormCard";
import ErrorAlertDialog from "@/components/ErrorAlertDialog";
import { useEffect } from "react";

function Form({
  name,
  fields,
  title,
  description,
  secondaryButton,
  buttons,
  schema,
  handleSubmit,
  showSeparator = false,
  className,
  bottomText,
  variant = "card",
  setOpen,
  open,
  refreshes = true,
  ...props
}: FormProps) {
  const { getError, setError, reset } = useForm(name);

  useEffect(() => {
    if (refreshes) reset();
  }, []);

  return (
    <>
      <ErrorAlertDialog error={getError()} setError={setError} />

      {variant === "card" ? (
        <FormCard
          className={className}
          title={title}
          description={description}
          secondaryButton={secondaryButton}
          handleSubmit={handleSubmit}
          name={name}
          showSeparator={showSeparator}
          fields={fields}
          bottomText={bottomText}
          buttons={buttons}
          variant={variant}
          refreshes={refreshes}
          schema={schema}
          {...props}
        />
      ) : (
        <FormDialog
          className={className}
          title={title}
          description={description}
          secondaryButton={secondaryButton}
          handleSubmit={handleSubmit}
          name={name}
          showSeparator={showSeparator}
          fields={fields}
          bottomText={bottomText}
          buttons={buttons}
          variant={variant}
          open={open}
          setOpen={setOpen}
          refreshes={refreshes}
          schema={schema}
          {...props}
        />
      )}
    </>
  );
}

export default Form;
