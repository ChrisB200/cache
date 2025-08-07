import { z } from "zod";

const sdworxSchema = z.object({
  sd_username: z.string().min(3, "Must be least 3 characters"),
  sd_password: z.string().min(3, "Must be at least 3 characters"),
});

export default sdworxSchema;
