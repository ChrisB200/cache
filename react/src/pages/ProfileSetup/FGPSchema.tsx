import { z } from "zod";

const fgpSchema = z.object({
  fgpUsername: z.string().min(3, "Must be least 3 characters"),
  fgpPassword: z.string().min(3, "Must be at least 3 characters"),
});

export default fgpSchema;
