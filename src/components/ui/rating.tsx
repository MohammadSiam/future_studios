export function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-border relative" aria-hidden>
        ★★★★★
        <span
          className="absolute inset-0 overflow-hidden text-amber-400"
          style={{ width: `${(value / 5) * 100}%` }}
        >
          ★★★★★
        </span>
      </span>
      <span className="text-muted text-xs">
        <span className="sr-only">Rated </span>
        {value.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>
    </div>
  );
}
