// throw new error import thing changed
import type { DisplayError } from "@/types/errors";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface FormStoreContextType {
  initForm: (key: string, initialValues: Record<string, any>) => void;
  getForm: (key: string) => Record<string, any>;
  updateField: (key: string, name: string, value: any) => void;
  resetForm: (key: string, initialValues?: Record<string, any>) => void;
  getErrors: (key: string) => Record<string, any>;
  setErrors: (key: string, newErrors: Record<string, any>) => void;
  addError: (key: string, name: string, value: any) => void;
  resetErrors: (key: string) => void;
  setFormError: (key: string, error: DisplayError | null) => void;
  getFormError: (key: string) => DisplayError | null;
  resetFormError: (key: string) => void;
}

export const FormStoreContext = createContext<FormStoreContextType | null>(
  null
);

interface FormStoreTypes {
  children: ReactNode;
}

export const FormStoreProvider = ({ children }: FormStoreTypes) => {
  const formsRef = useRef<Map<string, Record<string, any>>>(new Map());
  const errorsRef = useRef<Map<string, Record<string, any>>>(new Map());
  const formErrorsRef = useRef<Map<string, DisplayError | null>>(new Map());
  const [, forceUpdate] = useState(0);

  const setFormError = (key: string, error: DisplayError | null): void => {
    formErrorsRef.current.set(key, error);
    forceUpdate((n) => n + 1);
  };

  const getFormError = (key: string): DisplayError | null => {
    const error = formErrorsRef.current.get(key);
    if (error) {
      return error;
    } else {
      return null;
    }
  };

  const resetFormError = (key: string): void => {
    formErrorsRef.current.delete(key);
    forceUpdate((n) => n + 1);
  };

  const initForm = (key: string, initialValues: Record<string, any>) => {
    if (!formsRef.current.has(key)) {
      formsRef.current.set(key, initialValues);
      errorsRef.current.set(key, {});
      forceUpdate((n) => n + 1);
    }
  };

  const getForm = (key: string): Record<string, any> =>
    formsRef.current.get(key) ?? {};

  const getErrors = (key: string): Record<string, any> =>
    errorsRef.current.get(key) ?? {};

  const updateField = (key: string, name: string, value: any): void => {
    const form = getForm(key);
    formsRef.current.set(key, { ...form, [name]: value });
    resetErrors(key);
    forceUpdate((n) => n + 1);
  };

  const resetForm = (
    key: string,
    initialValues: Record<string, any> = {}
  ): void => {
    formsRef.current.set(key, initialValues);
    errorsRef.current.set(key, {});
    forceUpdate((n) => n + 1);
  };

  const resetErrors = (key: string): void => {
    errorsRef.current.set(key, {});
    forceUpdate((n) => n + 1);
  };

  const setErrors = (key: string, newErrors: Record<string, any>): void => {
    errorsRef.current.set(key, newErrors);
    forceUpdate((n) => n + 1);
  };

  const addError = (key: string, name: string, value: any): void => {
    const currentErrors = getErrors(key);
    errorsRef.current.set(key, { ...currentErrors, [name]: value });
    forceUpdate((n) => n + 1);
  };

  return (
    <FormStoreContext.Provider
      value={{
        initForm,
        getForm,
        updateField,
        resetForm,
        getErrors,
        setErrors,
        addError,
        resetErrors,
        getFormError,
        setFormError,
        resetFormError,
      }}
    >
      {children}
    </FormStoreContext.Provider>
  );
};

export const useFormStore = () => {
  const context = useContext(FormStoreContext);
  if (!context) {
    throw new Error("useFormStore must be used within a FormStoreContext");
  }
  return context;
};
