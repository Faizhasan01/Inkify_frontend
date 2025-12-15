import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function Sidebar({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
      />
      
      <div
        className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-neutral-900 border-r border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-300"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-display font-bold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}
