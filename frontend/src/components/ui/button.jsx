import * as React from "react";
import { cva } from "class-variance-authority";

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Slot = React.forwardRef(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, ref });
  }
  return null;
});
Slot.displayName = "Slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-neutral-950",
  {
    variants: {
      variant: {
        default: "bg-emerald-500 text-neutral-900 hover:bg-emerald-400",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-emerald-500/40 bg-transparent text-emerald-300 hover:bg-emerald-500/10",
        secondary: "bg-neutral-800 text-neutral-100 hover:bg-neutral-700",
        ghost: "bg-transparent hover:bg-neutral-900",
        link: "text-emerald-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
