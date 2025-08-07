import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("The email is invalid"),
  password: z.string().min(3, "The password is too short"),
});

export default loginSchema;
