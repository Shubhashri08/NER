import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Button({ 
  children, 
  dark = false, 
  onClick, 
  href,
  className = '',
  showArrow = true,
  ...props 
}) {
  const baseClasses = `inline-flex items-center gap-2.5 px-5 py-3 rounded-md text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-sm group ${
    dark 
      ? 'bg-[#081012] hover:bg-[#131d20] text-white border border-black/20 shadow-md' 
      : 'bg-[#f5f1e8] hover:bg-white text-[#080d0f] border border-white/30 shadow-lg hover:shadow-xl'
  } ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        <span>{children}</span>
        {showArrow && (
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        )}
      </motion.a>
    );
  }

  return (
    <motion.button 
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      <span>{children}</span>
      {showArrow && (
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </motion.button>
  );
}
