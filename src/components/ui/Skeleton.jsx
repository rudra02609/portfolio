import React from "react";

export default function Skeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="glass rounded-2xl p-6 h-[270px] flex flex-col justify-between relative overflow-hidden animate-pulse border border-white/5"
        >
          <div>
            {/* Header placeholder */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-3/5 bg-slate-800 rounded-md" />
              <div className="h-4 w-14 bg-slate-800 rounded-md" />
            </div>
            
            {/* Description lines */}
            <div className="space-y-2.5 mb-6">
              <div className="h-3.5 w-full bg-slate-800/80 rounded-md" />
              <div className="h-3.5 w-11/12 bg-slate-800/80 rounded-md" />
              <div className="h-3.5 w-4/5 bg-slate-800/80 rounded-md" />
            </div>
          </div>
          
          <div>
            {/* Tag pills */}
            <div className="flex gap-2 mb-5">
              <div className="h-5 w-14 bg-slate-800/70 rounded-full" />
              <div className="h-5 w-16 bg-slate-800/70 rounded-full" />
              <div className="h-5 w-12 bg-slate-800/70 rounded-full" />
            </div>
            
            {/* Buttons row */}
            <div className="flex gap-3 pt-4 border-t border-slate-900/60">
              <div className="h-9 w-24 bg-slate-800 rounded-lg" />
              <div className="h-9 w-24 bg-slate-800 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
