// components/ui/card.js
export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "p-4" }) {
  return <div className={className}>{children}</div>;
}
