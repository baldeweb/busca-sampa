import React, { useState } from 'react';

interface AccordionItemProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ label, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-4 text-left font-semibold text-lg focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{label}</span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="pb-4 text-base text-gray-700 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-200 shadow-sm">{children}</div>;
}
