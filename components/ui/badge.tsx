import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  );
}
