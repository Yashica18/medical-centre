import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show button if scrolled down past 400px
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollTop > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress percentage (0 to 100)
      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="sanjeevani-back-to-top"
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 sm:right-8 z-40 w-11 h-11 bg-white hover:bg-gray-50 text-teal-600 rounded-full flex items-center justify-center shadow-lg border border-gray-100 cursor-pointer group focus:outline-none"
          title="Back to Top"
        >
          {/* Radial progress circle border around the button */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="22"
              cy="22"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-teal-500/10"
            />
            <circle
              cx="22"
              cy="22"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={126}
              strokeDashoffset={126 - (126 * scrollProgress) / 100}
              className="text-teal-600 transition-all duration-75"
              strokeLinecap="round"
            />
          </svg>

          {/* Icon */}
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
