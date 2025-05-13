import * as React from "react";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  // onValueChange is currently unused but will be in future implementation
  ({ className, defaultValue, value, /* onValueChange, */ ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    // Tabs functionality to be implemented in the future
    // const handleValueChange = (newValue: string) => {
    //   if (value === undefined) {
    //     setSelectedValue(newValue);
    //   }
    //   onValueChange?.(newValue);
    // };

    return (
      <div 
        ref={ref} 
        className={`${className || ""}`} 
        {...props} 
        data-value={selectedValue}
      />
    );
  }
);

Tabs.displayName = "Tabs";

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md bg-gray-100 p-1 ${className || ""}`}
        role="tablist"
        {...props}
      />
    );
  }
);

TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // This is a used prop, don't remove
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  // value prop is required and will be used when implementing tab functionality
  ({ className, /* value, */ ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="tab"
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm ${className || ""}`}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  // This is a used prop, don't remove
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  // value prop is required and will be used when implementing tab functionality
  ({ className, /* value, */ ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tabpanel"
        className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${className || ""}`}
        {...props}
      />
    );
  }
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };