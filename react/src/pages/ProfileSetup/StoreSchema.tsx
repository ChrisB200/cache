import { z } from "zod";

const storeSchema = z.object({
  workplace: z.enum(["FIVEGUYS"], {
    errorMap: () => ({
      message: "Please select a valid workplace",
    }),
  }),
  open: z.string().refine((val) => /^([01]\d|2[0-3]):[0-5]\d$/.test(val), {
    message: "Time must be in 24-hour format (HH:MM)",
  }),
  close: z.string().refine((val) => /^([01]\d|2[0-3]):[0-5]\d$/.test(val), {
    message: "Time must be in 24-hour format (HH:MM)",
  }),
});

export default storeSchema;
