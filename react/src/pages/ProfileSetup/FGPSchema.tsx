import { z } from "zod";

const fgpSchema = z.object({
  fgp_username: z.string().min(3, "Must be least 3 characters"),
  fgp_password: z.string().min(3, "Must be at least 3 characters"),
});

export default fgpSchema;
