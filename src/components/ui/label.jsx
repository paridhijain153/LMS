import * as React from "react";
import { clsx } from "clsx";
import "@/styles/components/form.css";
const Label = React.forwardRef(({ className, ...props }, ref) => (<label ref={ref} className={clsx("form-label", className)} {...props}/>));
Label.displayName = "Label";
export { Label };
