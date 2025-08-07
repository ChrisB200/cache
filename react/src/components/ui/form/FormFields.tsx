import useForm from "@/hooks/useForm";
import type { FieldGroup } from "@/types/form";
import { Label } from "../label";
import ChooseElement from "./ChooseElement";

interface FormFieldsProps {
  fields: FieldGroup[];
  name: string;
}

const FormFields = ({ name, fields }: FormFieldsProps) => {
  const { values, handleChange, errors } = useForm(name);
  return (
    <>
      {fields.map((item: FieldGroup, i: number) => {
        if (Array.isArray(item)) {
          let err: string | null = null;
          return (
            <div key={i} className="w-full flex flex-col gap-2">
              <div key={i} className="flex flex-col md:flex-row gap-6">
                {item.map((field) => {
                  const error = errors[field.name];
                  err = error ? error : err;
                  return (
                    <div key={field.name} className="flex-1 grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={field.name}>{field.label}</Label>
                        {field.trailingContent && (
                          <div>{field.trailingContent}</div>
                        )}
                      </div>
                      <ChooseElement
                        field={field}
                        values={values}
                        handleChange={handleChange}
                        error={error}
                      />
                    </div>
                  );
                })}
              </div>
              {err && (
                <p className="text-destructive dark:text-destructive text-sm">
                  {err}
                </p>
              )}
            </div>
          );
        } else {
          const error = errors[item.name];
          // Single field
          return (
            <div key={item.name} className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={item.name}>{item.label}</Label>
                {item.trailingContent && <div>{item.trailingContent}</div>}
              </div>
              <ChooseElement
                field={item}
                values={values}
                handleChange={handleChange}
                error={error}
              />
              {error && (
                <p className="text-destructive dark:text-destructive text-sm">
                  {error}
                </p>
              )}
            </div>
          );
        }
      })}
    </>
  );
};

export default FormFields;
