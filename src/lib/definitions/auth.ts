import * as z from "zod";

// Usuário: só letras minúsculas, números, ponto, hífen e underscore —
// evita confusão visual e problemas de URL/exibição.
const usernameSchema = z
  .string()
  .trim()
  .min(3, { error: "O usuário precisa ter pelo menos 3 caracteres." })
  .max(32, { error: "O usuário pode ter no máximo 32 caracteres." })
  .regex(/^[a-z0-9_.-]+$/, {
    error: "Use apenas letras minúsculas, números, ponto, - ou _.",
  });

const passwordSchema = z
  .string()
  .min(8, { error: "A senha precisa ter pelo menos 8 caracteres." });

export const RegisterFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const LoginFormSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, { error: "Informe a senha." }),
});

export type AuthFormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
