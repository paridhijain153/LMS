import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import "@/styles/components/accordion.css";
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (<AccordionPrimitive.Item ref={ref} className={clsx("accordion-item", className)} {...props}/>));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (<AccordionPrimitive.Header style={{ display: "flex" }}>
    <AccordionPrimitive.Trigger ref={ref} className={clsx("accordion-trigger", className)} {...props}>
      {children}
      <ChevronDown className="accordion-chevron"/>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (<AccordionPrimitive.Content ref={ref} className="accordion-content" {...props}>
    <div className={clsx("accordion-content-inner", className)}>{children}</div>
  </AccordionPrimitive.Content>));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
