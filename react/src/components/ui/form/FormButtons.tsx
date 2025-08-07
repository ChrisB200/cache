import { Button } from "../button";
import type { ButtonGroup } from "@/types/form";

interface FormButtonsProps {
  buttons: ButtonGroup[];
}

const FormButtons = ({ buttons }: FormButtonsProps) => {
  return (
    <>
      {buttons.map((item, i) => {
        if (Array.isArray(item)) {
          // Group of buttons side by side
          return (
            <div key={i} className="flex flex-row gap-6">
              {item.map((button, idx) => (
                <Button
                  key={button.text || idx}
                  type={button.type || "button"}
                  variant={button.variant || "outline"}
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {button.icon}
                  {button.text}
                </Button>
              ))}
            </div>
          );
        }

        // Single button (not grouped)
        return (
          <Button
            key={item.text || i}
            type={item.type || "button"}
            variant={item.variant || "outline"}
            onClick={item.onClick}
            disabled={item.disabled}
            className="w-full flex items-center justify-center gap-2"
          >
            {item.icon}
            {item.text}
          </Button>
        );
      })}
    </>
  );
};

export default FormButtons;
