"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07090e] text-[#f9fafb] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#121826] border border-[#a3e635]/30 rounded-2xl p-8 shadow-2xl space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 text-xl font-black">
            !
          </div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Application Interrupted
          </h2>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            A system error occurred and has been automatically logged with error telemetry.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2.5 rounded-xl bg-[#ccff00] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:opacity-90 transition-opacity cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
