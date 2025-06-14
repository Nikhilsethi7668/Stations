// components/ui/select.js
"use client";

import { useState } from "react";

// Main Select wrapper
export function Select({ onValueChange,valueChange, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(valueChange||"Select...");

  // Enhance children with handler
  const enhancedChildren = children.map((child) => {
    if (child.type?.name === "SelectContent") {
      const content = child.props.children.map((item) =>
        item.type?.name === "SelectItem"
          ? {
              ...item,
              props: {
                ...item.props,
                onSelect: (val, label) => {
                  setSelectedLabel(label);
                  onValueChange(val);
                  setIsOpen(false);
                },
              },
            }
          : item
      );
      return { ...child, props: { ...child.props, children: content } };
    }
    return child;
  });

  return (
    <div className="relative w-full">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer border rounded-xl px-4 py-2 bg-white shadow-sm">
        {selectedLabel}
      </div>
      {isOpen && (
        <div className="absolute mt-2 bg-white border shadow-md rounded-xl w-full z-10">
          {enhancedChildren}
        </div>
      )}
    </div>
  );
}

// Subcomponents
export function SelectTrigger({ children }) {
  return <div>{children}</div>;
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-400 px-4 py-2">{placeholder}</span>;
}

export function SelectContent({ children }) {
  return <div className="space-y-1 px-1 py-2">{children}</div>;
}

export function SelectItem({ value, children, onSelect }) {
  return (
    <div
      onClick={() => onSelect?.(value, children)}
      className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-md"
    >
      {children}
    </div>
  );
}
