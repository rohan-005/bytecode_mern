import React from 'react';

/**
 * SkeletonLoader Component
 * Sharp-edge skeleton loaders for developer platform UI
 */
export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-[#454C50] border border-[#626A6E] p-5 ${className}`}>
    <div className="skeleton-box h-6 w-3/4 mb-4"></div>
    <div className="skeleton-box h-4 w-full mb-2"></div>
    <div className="skeleton-box h-4 w-5/6 mb-4"></div>
    <div className="flex justify-between items-center pt-2">
      <div className="skeleton-box h-8 w-24"></div>
      <div className="skeleton-box h-6 w-16"></div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2.5 ${className}`}>
    {Array.from({ length: lines }).map((_, idx) => (
      <div
        key={idx}
        className="skeleton-box h-4"
        style={{ width: `${100 - (idx % 3) * 15}%` }}
      ></div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 4, cols = 4, className = "" }) => (
  <div className={`bg-[#454C50] border border-[#626A6E] overflow-hidden ${className}`}>
    <div className="bg-[#2F3437] border-b border-[#626A6E] p-4 flex gap-4">
      {Array.from({ length: cols }).map((_, idx) => (
        <div key={idx} className="skeleton-box h-4 flex-1"></div>
      ))}
    </div>
    <div className="divide-y divide-[#626A6E]">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="p-4 flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="skeleton-box h-4 flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonEditor = ({ className = "" }) => (
  <div className={`bg-[#2F3437] border border-[#626A6E] p-4 flex flex-col h-full ${className}`}>
    <div className="flex items-center gap-3 border-b border-[#626A6E] pb-3 mb-4">
      <div className="skeleton-box h-6 w-32"></div>
      <div className="skeleton-box h-6 w-24"></div>
      <div className="skeleton-box h-6 w-20 ml-auto"></div>
    </div>
    <div className="space-y-3 flex-1">
      <div className="skeleton-box h-4 w-1/3"></div>
      <div className="skeleton-box h-4 w-2/3 ml-6"></div>
      <div className="skeleton-box h-4 w-1/2 ml-6"></div>
      <div className="skeleton-box h-4 w-3/4 ml-12"></div>
      <div className="skeleton-box h-4 w-2/5"></div>
    </div>
  </div>
);

export const SkeletonProfile = () => (
  <div className="bg-[#454C50] border border-[#626A6E] p-6 max-w-4xl mx-auto space-y-6">
    <div className="flex items-center gap-6">
      <div className="skeleton-box h-20 w-20 border border-[#626A6E]"></div>
      <div className="space-y-2 flex-1">
        <div className="skeleton-box h-7 w-48"></div>
        <div className="skeleton-box h-4 w-64"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#626A6E]">
      <div className="skeleton-box h-24"></div>
      <div className="skeleton-box h-24"></div>
      <div className="skeleton-box h-24"></div>
    </div>
  </div>
);

export default SkeletonCard;
