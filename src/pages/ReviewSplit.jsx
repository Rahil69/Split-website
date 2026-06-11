import React from "react";
import { ArrowLeft } from "lucide-react";
const ReviewSplit = () => {
  return (
    <div className="min-h-screen bg-neutral-100 px-4 pt-24 text-black">
      <header className="fixed left-1/2 top-0 z-20 w-full max-w-md -translate-x-1/2 border-b border-white/80 bg-neutral-100/85 px-4 py-4 backdrop-blur-xl">
        <div className="relative flex items-center justify-center">
          <button className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-emerald-900 shadow-sm hover:cursor-pointer">
            <ArrowLeft size={22} />
          </button>
          <div className="text-center">
            <p className="text-lg font leading-tight">Review details</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Confirm everything before sending request
            </p>
          </div>
        </div>
      </header>
    </div>
  );
};

export default ReviewSplit;
