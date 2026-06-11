import React from "react";
import { HandCoins, ReceiptText } from "lucide-react";
const DebtCards = ({ title, amount, subtitle, colour }) => {
  const Icon = title === "YOU OWE" ? ReceiptText : HandCoins;

  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 p-5 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full">
        <p className=" rounded-full bg-neutral-100 px-3 py-1 text-[11px] tracking-wide text-neutral-600">
          {title}
        </p>
      </div>
      <p className={`mt-2 text-lg font-medium ${colour}`}>{amount}</p>
      <p className="mt-1 text-xs text-neutral-600 font-light">{subtitle}</p>
    </div>
  );
};

export default DebtCards;
