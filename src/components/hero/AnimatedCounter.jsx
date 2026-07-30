import React, { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

export default function AnimatedCounter({ value, suffix = "", label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const isDecimal = !Number.isInteger(value);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = progress * value;
      setCount(isDecimal ? Number(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value, isDecimal]);

  return (
    <motion.div ref={ref} className="text-center">
      <p className="text-2xl sm:text-3xl font-display font-extrabold text-white">
        {count}
        {suffix}
      </p>
      <p className="text-xs sm:text-sm text-white/70">{label}</p>
    </motion.div>
  );
}
