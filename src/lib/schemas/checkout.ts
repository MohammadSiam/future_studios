import { z } from "zod";

export const PAYMENT_METHODS = {
  "cash-on-delivery": "Cash on delivery",
  "card-on-delivery": "Card on delivery",
} as const;

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your street address"),
  city: z.string().trim().min(2, "Enter your city"),
  postalCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9\s-]{3,10}$/, "Enter a valid postal code"),
  paymentMethod: z.enum(
    Object.keys(PAYMENT_METHODS) as [keyof typeof PAYMENT_METHODS],
    {
      error: "Select a payment method",
    },
  ),
});

export const orderSchema = z.object({
  customer: checkoutSchema,
  items: z
    .array(
      z.object({ slug: z.string(), quantity: z.number().int().positive() }),
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
