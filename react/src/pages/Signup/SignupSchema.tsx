import { z } from "zod";

const signupSchema = z
  .object({
    email: z.string().email("The email is invalid"),
    password: z.string().min(8, "The password is too short"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirm"],
    message: "The passwords must be equal",
  })
  .superRefine(({ password }, ctx) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!(hasUpper && hasLower && hasNumber && hasSymbol)) {
      ctx.addIssue({
        path: ["password"],
        code: "custom",
        message:
          "Password must include uppercase, lowercase, number, and special character",
      });
    }
  });

export default signupSchema;
