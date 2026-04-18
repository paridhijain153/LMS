import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";
import "@/styles/components/select.css";
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (<SelectPrimitive.Trigger ref={ref} className={clsx("select-trigger", className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown style={{ width: "1rem", height: "1rem", opacity: 0.5 }}/>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (<SelectPrimitive.ScrollUpButton ref={ref} className={clsx("select-scroll-btn", className)} {...props}>
    <ChevronUp style={{ width: "1rem", height: "1rem" }}/>
  </SelectPrimitive.ScrollUpButton>));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (<SelectPrimitive.ScrollDownButton ref={ref} className={clsx("select-scroll-btn", className)} {...props}>
    <ChevronDown style={{ width: "1rem", height: "1rem" }}/>
  </SelectPrimitive.ScrollDownButton>));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (<SelectPrimitive.Portal>
    <SelectPrimitive.Content ref={ref} className={clsx("select-content", className)} position={position} {...props}>
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className="select-viewport">
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (<SelectPrimitive.Label ref={ref} className={clsx("select-label", className)} {...props}/>));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (<SelectPrimitive.Item ref={ref} className={clsx("select-item", className)} {...props}>
    <span className="select-item-indicator">
      <SelectPrimitive.ItemIndicator>
        <Check style={{ width: "1rem", height: "1rem" }}/>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (<SelectPrimitive.Separator ref={ref} className={clsx("select-separator", className)} {...props}/>));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton, };
