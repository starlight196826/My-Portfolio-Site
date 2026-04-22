"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SectionLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <motion.div
      role="status"
      aria-label={label}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      className="inline-flex h-16 w-16 items-center justify-center"
    >
      <Image
        src="/logo.png"
        alt="Loading logo"
        width={64}
        height={64}
        className="h-16 w-16 [filter:hue-rotate(-10deg)_saturate(1.25)_contrast(1.1)_brightness(1.03)] dark:[filter:hue-rotate(18deg)_saturate(1.35)_contrast(1.1)_brightness(1.08)]"
      />
    </motion.div>
  );
}
