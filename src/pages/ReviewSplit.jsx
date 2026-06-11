import React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
const ReviewSplit = ({ setActivePage }) => {
  return (
    <div className="min-h-screen bg-neutral-100 px-4 pt-24 text-black">
      <header className="fixed left-1/2 top-0 z-20 w-full max-w-md -translate-x-1/2 border-b border-white/80 bg-neutral-100/85 px-4 py-4 backdrop-blur-2xl">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => setActivePage("Split")}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-emerald-900 shadow-sm hover:cursor-pointer"
          >
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
      <section className="rounded-3xl border border-white/80 bg-white/70 p-5 backdrop-blur-xl">
        <p className="text-xs tracking-wide text-neutral-600">SPLIT SUMMARY</p>
        <h1 className="mt-2 text-2xl font-thin text-black">Almost ready</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Your split details will show here before confirmation requests are
          sent
        </p>
      </section>
    </div>
  );
};

export default ReviewSplit;
