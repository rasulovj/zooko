"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function ZookoLoader({ size = 120, text }: { size?: number; text?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <DotLottieReact src="/loading.lottie" loop autoplay style={{ width: size, height: size }} />
      {text && <p className="text-[13px] text-[var(--foreground)]/40 font-medium tracking-wide">{text}</p>}
    </div>
  );
}
