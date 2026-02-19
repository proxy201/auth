import { z } from 'zod';

/* ── Signup ──────────────────────────────────────────────── */
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3,  'Username must be at least 3 characters')
      .max(30, 'Username must be 30 characters or less')
      .regex(
        /^[a-zA-Z0-9_.-]+$/,
        'Username can only contain letters, numbers, underscores, hyphens and dots',
      )
      .trim(),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/,       'Password must contain at least one uppercase letter')
      .regex(/[a-z]/,       'Password must contain at least one lowercase letter')
      .regex(/[0-9]/,       'Password must contain at least one number'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path:    ['confirmPassword'],
  });

/* ── Login ───────────────────────────────────────────────── */
export const loginSchema = z.object({
  name:     z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput  = z.infer<typeof loginSchema>;
