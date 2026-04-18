import * as React from "react";
import { clsx } from "clsx";
import "@/styles/components/form.css";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (<textarea className={clsx("form-textarea", className)} ref={ref} {...props}/>);
});
Textarea.displayName = "Textarea";
export { Textarea };
