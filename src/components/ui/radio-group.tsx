import * as React from "react";

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ 
  className, 
  defaultValue,
  ...props 
}) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleItemChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <div 
      className={`space-y-2 ${className || ""}`} 
      role="radiogroup"
      {...props}
    />
  );
};

RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={`h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 ${className || ""}`}
        value={value}
        id={id}
        ref={ref}
        {...props}
      />
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };