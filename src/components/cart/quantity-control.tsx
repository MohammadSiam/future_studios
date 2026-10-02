import { Minus, Plus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
  label: string;
}

const BUTTON_CLASS =
  "flex size-9 items-center justify-center hover:bg-surface disabled:pointer-events-none disabled:opacity-40";

export function QuantityControl({
  quantity,
  max,
  onChange,
  label,
}: QuantityControlProps) {
  return (
    <div
      className="border-border inline-flex items-center rounded-md border"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={BUTTON_CLASS}
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span
        className="w-10 text-center text-sm tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        className={BUTTON_CLASS}
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
