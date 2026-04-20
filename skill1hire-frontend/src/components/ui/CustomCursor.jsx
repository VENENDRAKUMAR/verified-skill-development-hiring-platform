"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        animate={{
          x: mousePos.x - 4,
          y: mousePos.y - 4,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0 }}
        style={{
          position: "fixed", top: 0, left: 0, width: 8, height: 8,
          backgroundColor: "var(--amber)", borderRadius: "50%",
          pointerEvents: "none", zIndex: 10000,
        }}
      />
      <motion.div
        animate={{
          x: mousePos.x - (isHovering ? 24 : 16),
          y: mousePos.y - (isHovering ? 24 : 16),
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(212, 175, 55, 0.1)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
        style={{
          position: "fixed", top: 0, left: 0, width: 32, height: 32,
          border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: "50%",
          pointerEvents: "none", zIndex: 9999,
          backdropFilter: isHovering ? "blur(4px)" : "none",
        }}
      />
    </>
  );
}
