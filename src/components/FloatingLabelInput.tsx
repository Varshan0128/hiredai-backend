
import React, { forwardRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ id, label, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input 
          id={id}
          ref={ref}
          className={cn(
            "peer pl-3 pt-6 pb-2 h-14",
            className
          )}
          placeholder=" "
          {...props}
        />
        <Label 
          htmlFor={id}
          className="absolute left-3 top-2 text-xs text-muted-foreground peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-muted-foreground/60 transition-all peer-focus:top-2 peer-focus:text-xs"
        >
          {label}
        </Label>
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
