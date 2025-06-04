// components/SideDrawer.js
"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export default function SideDrawer({ title, isOpen, onClose, children }) {
  useEffect(() => {
    if(isOpen) 
      {document.body.style.overflow = "hidden";}
    else {document.body.style.overflow = "auto";}
  }, [isOpen]);

  if (!isOpen)
    { return null;}

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-full bg-white shadow-xl h-full overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
