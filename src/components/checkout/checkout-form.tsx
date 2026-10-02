"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { placeOrder } from "@/app/checkout/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  checkoutSchema,
  PAYMENT_METHODS,
  type CheckoutFormValues,
} from "@/lib/schemas/checkout";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface CheckoutFormProps {
  items: CartItem[];
  onOrderPlaced: (orderId: string) => void;
}

type TextFieldName = Exclude<keyof CheckoutFormValues, "paymentMethod">;

const TEXT_FIELDS: {
  name: TextFieldName;
  label: string;
  type?: string;
  autoComplete: string;
  wide?: boolean;
}[] = [
  { name: "fullName", label: "Full name", autoComplete: "name", wide: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  {
    name: "address",
    label: "Street address",
    autoComplete: "street-address",
    wide: true,
  },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postalCode", label: "Postal code", autoComplete: "postal-code" },
];

const DEFAULT_VALUES: CheckoutFormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  paymentMethod: "cash-on-delivery",
};

export function CheckoutForm({ items, onOrderPlaced }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });

  async function onSubmit(customer: CheckoutFormValues) {
    const result = await placeOrder({
      customer,
      items: items.map(({ slug, quantity }) => ({ slug, quantity })),
    });

    if (result.success) {
      onOrderPlaced(result.orderId);
    } else {
      setError("root", { message: result.error });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="mb-4 text-lg font-semibold">Shipping details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT_FIELDS.map(
            ({ name, label, type = "text", autoComplete, wide }) => {
              const error = errors[name]?.message;
              return (
                <div
                  key={name}
                  className={cn("space-y-1", wide && "sm:col-span-2")}
                >
                  <label htmlFor={name} className="text-sm font-medium">
                    {label}
                  </label>
                  <Input
                    id={name}
                    type={type}
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${name}-error` : undefined}
                    className={cn(error && "border-red-600")}
                    {...register(name)}
                  />
                  {error && (
                    <p id={`${name}-error`} className="text-xs text-red-600">
                      {error}
                    </p>
                  )}
                </div>
              );
            },
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-4 text-lg font-semibold">Payment method</legend>
        {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
          <label
            key={value}
            className="border-border has-checked:border-primary flex cursor-pointer items-center gap-3 rounded-md border p-4"
          >
            <input
              type="radio"
              value={value}
              className="accent-primary"
              {...register("paymentMethod")}
            />
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
        {errors.paymentMethod && (
          <p className="text-xs text-red-600">{errors.paymentMethod.message}</p>
        )}
      </fieldset>

      {errors.root && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          {errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="h-12 w-full">
        {isSubmitting ? "Placing order…" : "Place order"}
      </Button>
    </form>
  );
}
