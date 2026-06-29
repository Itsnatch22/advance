"use client";
import React from "react";
import { cn } from "@/lib/utils/utils";

export default function PhoneShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto h-[580px] w-[280px] shrink-0 rounded-[2.5rem] bg-[#0A0A0A]",
        "shadow-[0_40px_80px_rgba(0,0,0,0.3)]",
        "will-change-transform",
        className
      )}
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Inner screen */}
      <div className="absolute inset-[3px] flex flex-col overflow-hidden rounded-[2.2rem] bg-[#F8F9F7]">
        {/* Dynamic Island */}
        <div className="flex shrink-0 justify-center pb-1 pt-3.5">
          <div className="h-[26px] w-[100px] rounded-full bg-[#0A0A0A]" />
        </div>
        {/* Content */}
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
