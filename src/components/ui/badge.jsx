import * as React from "react";
import { clsx } from "clsx";
import "@/styles/components/badge.css";
const variantClass = {
    default: "badge--default",
    secondary: "badge--secondary",
    destructive: "badge--destructive",
    outline: "badge--outline",
};
function Badge({ className, variant = "default", ...props }) {
    return (<div className={clsx("badge", variantClass[variant], className)} {...props}/>);
}
export { Badge };
