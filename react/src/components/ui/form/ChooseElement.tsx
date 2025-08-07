import type { ChangeEvent } from "react";
import type { FieldVariant } from "@/types/form";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";

interface ChooseElementProps {
  handleChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => void;
  field: FieldVariant;
  values: Record<string, any>;
  error: string;
}

const ChooseElement = ({
  handleChange,
  field,
  values,
  error,
}: ChooseElementProps) => {
  if (field.element === "input") {
    return (
      <Input
        id={field.name}
        type={field.type}
        placeholder={field.placeholder}
        value={values[field.name] ?? ""}
        onChange={handleChange}
        required={field.required}
        {...field}
      />
    );
  } else if (field.element === "input-otp") {
    const otpValue = values[field.name] ?? "";

    return (
      <InputOTP
        maxLength={field.maxLength}
        pattern={field.pattern ?? REGEXP_ONLY_DIGITS}
        name={field.name}
        className={cn("w-full", field.className)}
        value={otpValue}
        onChange={(newValue: string) => {
          handleChange({
            target: { name: field.name, value: newValue },
          } as unknown as ChangeEvent<HTMLInputElement>);
        }}
      >
        <InputOTPGroup className="w-full">
          {Array.from({ length: field.maxLength }, (_, i) => (
            <InputOTPSlot key={i} index={i} className="w-full" />
          ))}
        </InputOTPGroup>
      </InputOTP>
    );
  } else if (field.element === "select") {
    return (
      <Select
        value={values[field.name] ?? ""}
        onValueChange={(val) =>
          handleChange({
            target: {
              name: field.name,
              value: val,
              type: "select-one",
            },
          } as unknown as ChangeEvent<HTMLSelectElement>)
        }
      >
        <SelectTrigger id={field.name}>
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent className={error && "border-destructive"}>
          {field.options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return null;
};

export default ChooseElement;
