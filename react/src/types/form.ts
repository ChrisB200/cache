import type {
  ComponentProps,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import type { ButtonProps } from "@/components/ui/button";
import type { ComponentPropsWithoutRef } from "react";
import type { OTPInput } from "input-otp";
import type { ZodType } from "zod";

export interface SelectOptions {
  value: any;
  label: string;
}

export interface Field {
  element: string;
  label: string;
  trailingContent?: ReactNode;
}

export interface InputField
  extends Field,
    InputHTMLAttributes<HTMLInputElement> {
  element: "input";
  name: string;
}

export interface SelectField
  extends Field,
    SelectHTMLAttributes<HTMLSelectElement> {
  element: "select";
  name: string;
  options: SelectOptions[];
  placeholder: string;
}

export type InputOTPFieldCombined = Field &
  ComponentPropsWithoutRef<typeof OTPInput> & {
    element: "input-otp";
    name: string;
    className?: string;
  };

type InputOTPField = Omit<InputOTPFieldCombined, "children">;

export type FieldVariant = InputField | SelectField | InputOTPField;

export type FieldGroup = FieldVariant | FieldVariant[];

export interface FormButtonProps extends ButtonProps {
  icon?: ReactNode;
  text: string;
}

export type ButtonGroup = FormButtonProps | FormButtonProps[];

export interface FormValues extends ComponentProps<"div"> {
  name: string;
  fields: FieldGroup[];
  title: string;
  description?: string;
  buttons: ButtonGroup[];
  secondaryButton?: FormButtonProps;
  showSeparator?: boolean;
  bottomText?: ReactNode;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  schema?: ZodType;
  open?: boolean;
  setOpen?: any;
  refreshes?: boolean;
}

export interface FormCardProps extends FormValues {
  variant: "card";
}

export interface FormDialogProps extends FormValues {
  variant: "dialog";
}

export type FormProps = FormCardProps | FormDialogProps;
