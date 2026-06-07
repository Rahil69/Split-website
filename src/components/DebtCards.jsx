import React from "react";
import { Wallet } from "lucide-react";
const DebtCards = ({ title, amount, subtitle, colour }) => {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="rounded-xl bg-emerald-100/60 p-2">
          <Wallet size={18} className="text-emerald-900" />
        </div>

        <p className="text-xs tracking-wide text-black">{title}</p>
      </div>
      <p className={`mt-3 text-lg font-semibold ${colour}`}>{amount}</p>
      <p className="mt-1 text-xs text-neutral-600">{subtitle}</p>
    </div>
  );
};

export default DebtCards;
