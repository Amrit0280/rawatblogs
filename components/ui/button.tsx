import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--primary)] px-4 text-[var(--primary-foreground)] shadow-sm hover:opacity-92",
        secondary:
          "border-[var(--border)] bg-[var(--card)] px-4 text-[var(--foreground)] hover:bg-[var(--muted)]",
        ghost: "border-transparent bg-transparent px-3 hover:bg-[var(--muted)]",
        gold:
          "border-transparent bg-[var(--accent)] px-4 text-[#101827] shadow-sm hover:brightness-95",
        danger:
          "border-transparent bg-[var(--danger)] px-4 text-white shadow-sm hover:brightness-95"
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
