import React from "react";
import { HandCoins, ReceiptText } from "lucide-react";
const DebtCards = ({ title, amount, subtitle, colour }) => {
  const Icon = title === "YOU OWE" ? ReceiptText : HandCoins;

  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 p-5 backdrop-blur-xl">
      <div className="flex items-center ">
        <div className="rounded-xl  p-2 ">
          <Icon size={18} className="text-emerald-900" />
        </div>

        <p className="text-sm tracking-wide text-black font-semibold">
          {title}
        </p>
      </div>
      <p className={`mt-3 text-lg font-semibold ${colour}`}>{amount}</p>
      <p className="mt-1 text-xs text-neutral-600">{subtitle}</p>
    </div>
  );
};

export default DebtCards;
