import { useEffect, type ChangeEvent } from "react";
import { useFormStore } from "@/contexts/FormStoreContext";
import type { DisplayError } from "@/types/errors";
import type { ZodType } from "zod";

export default function useForm<T extends Record<string, any>>(
  key: string,
  initialValues?: T
) {
  const {
    initForm,
    getForm,
    updateField,
    resetForm,
    getErrors,
    setErrors,
    addError,
    getFormError,
    setFormError,
  } = useFormStore();

  useEffect(() => {
    if (initialValues) initForm(key, initialValues);
  }, [key, initialValues, initForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateField(key, name, value);
  };

  const validate = (schema: ZodType<T, any, any>) => {
    const values = getForm(key) as T;
    const result = schema.safeParse(values);
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors;
      const formatted: Record<string, string> = {};
      Object.entries(errs).forEach(([k, v]) => {
        formatted[k] = v?.[0] ?? "Invalid";
      });
      setErrors(key, formatted);
      return false;
    }
    return true;
  };

  const values = getForm(key) as T;
  const errors = getErrors(key) as Record<keyof T, string>;

  return {
    values,
    errors,
    handleChange,
    reset: () => resetForm(key, initialValues as T),
    setErrors: (err: Record<string, string>) => setErrors(key, err),
    addError: (name: string, value: string) => addError(key, name, value),
    validate,
    getError: () => getFormError(key),
    setError: (error: DisplayError | null) => setFormError(key, error),
  };
}
