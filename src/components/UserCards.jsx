import React from "react";
import { CircleUser } from "lucide-react";
const UserCards = ({ title, subtitle, colour, amount }) => {
  return (
    <div className="mt-4 rounded-3xl border border-white/80 bg-white/70 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100/60 p-2">
            <CircleUser size={28} className="text-emerald-900" />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-900"> {title}</p>
            <p className="mt-1 text-xs text-neutral-700">{subtitle}</p>
          </div>
        </div>
        <p className={`text-sm font-semibold ${colour}`}>{amount}</p>
      </div>
    </div>
  );
};

export default UserCards;
