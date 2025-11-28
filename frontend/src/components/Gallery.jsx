import React from "react";
import { motion } from "framer-motion";

export default function Gallery({ images }) {
  if (!images || images.length === 0)
    return (
      <p className="text-center text-white/70 mt-6">
        No images yet. Generate one!
      </p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {images.map((img, idx) => (
        <motion.img
          key={idx}
          src={img}
          className="rounded-2xl shadow-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        />
      ))}
    </div>
  );
}
