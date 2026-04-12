import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';

export const AtmosphericMetadata = ({ isVisible }) => {
  return (
    <div className={cn(
      "fixed left-8 top-1/2 -translate-y-1/2 z-[300] flex flex-col gap-16 transition-opacity duration-1000 mix-blend-difference",
      isVisible ? "opacity-30" : "opacity-0 pointer-events-none"
    )}>
      <div className="flex flex-col gap-4 items-center">
        <div className="w-[1px] h-12 bg-white/40" />
        <a 
          href="https://www.npmjs.com/~yogeshrathod" 
          target="_blank" 
          rel="noopener noreferrer"
          className="minimal-body text-[8px] tracking-[0.4rem] [writing-mode:vertical-lr] hover:text-molten-red transition-colors"
        >
          NPM // REPO
        </a>
      </div>
      
      <div className="flex flex-col gap-4 items-center">
        <a 
          href="https://marketplace.visualstudio.com/publishers/yogeshhrathod" 
          target="_blank" 
          rel="noopener noreferrer"
          className="minimal-body text-[8px] tracking-[0.4rem] [writing-mode:vertical-lr] hover:text-molten-red transition-colors"
        >
          VSCODE // MARKET
        </a>
        <div className="w-[1px] h-12 bg-white/40" />
      </div>

      {/* Decorative Technical Artifact */}
      <div className="minimal-body text-[6px] opacity-40 [writing-mode:vertical-lr] tracking-[0.2rem]">
        STATUS // ACTIVE_NODE
      </div>
    </div>
  );
};
