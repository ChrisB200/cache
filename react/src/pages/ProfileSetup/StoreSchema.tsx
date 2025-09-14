import { z } from "zod";

const storeSchema = z.object({
  workplace: z.enum(["FIVEGUYS"]).refine((val) => ["FIVEGUYS"].includes(val), {
    message: "Please select a valid workplace",
  }),
  open: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "Time must be in 24-hour format (HH:MM)",
  }),
  close: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "Time must be in 24-hour format (HH:MM)",
  }),
});

export default storeSchema;
