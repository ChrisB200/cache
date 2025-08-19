import { z } from "zod";

const sdworxSchema = z.object({
  sdUsername: z.string().min(3, "Must be least 3 characters"),
  sdPassword: z.string().min(3, "Must be at least 3 characters"),
});

export default sdworxSchema;
