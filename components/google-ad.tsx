"use client";

import { useEffect } from "react";

interface GoogleAdProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: "true" | "false";
  className?: string;
}

export function GoogleAd({ slot, format = "auto", responsive = "true", className }: GoogleAdProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`ad-container my-8 flex justify-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3506540593942025"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
