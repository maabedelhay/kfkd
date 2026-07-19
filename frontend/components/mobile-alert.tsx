"use client";

import { useEffect, useState } from "react";

export function MobileAlert() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) setShow(true);
    else setShow(false);
  }, []);

  if (show === null) return null;
  if (!show) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-8">
      <div className="text-center max-w-xs">
  
        <pre>
        _____
        (.---.)-._.-.
        /:::\ _.---'
        '-----'    
        </pre>
        <h1 className="text-xl font-semibold text-zinc-900 mb-2">Hi mobile user!</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">
          This demo is best viewed on a desktop or tablet in landscape orientation.
        </p>
      </div>
    </div>
  );
}
