import * as React from "react";

// Card root component
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card header component
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card title component
export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-xl font-semibold leading-none tracking-tight ${className || ""}`}
      {...props}
    >
      {children}
    </h3>
  );
}

// Card description component
export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm text-gray-500 ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}

// Card content component
export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-6 pt-0 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card footer component
export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center p-6 pt-0 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}