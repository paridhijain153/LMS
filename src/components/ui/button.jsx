import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import "@/styles/components/button.css";
const variantClass = {
    default: "btn--default",
    hero: "btn--hero",
    destructive: "btn--destructive",
    outline: "btn--outline",
    secondary: "btn--secondary",
    soft: "btn--soft",
    ghost: "btn--ghost",
    link: "btn--link",
};
const sizeClass = {
    default: "btn--default-size",
    sm: "btn--sm",
    lg: "btn--lg",
    xl: "btn--xl",
    icon: "btn--icon",
};
const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (<Comp className={clsx("btn", variantClass[variant], sizeClass[size], className)} ref={ref} {...props}/>);
});
Button.displayName = "Button";
export { Button };
