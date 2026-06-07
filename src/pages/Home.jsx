import React from "react";
import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";
import DebtCards from "../components/DebtCards";
import UserCards from "../components/UserCards";

const Home = () => {
  const youOwe = "2,620.00 MVR";
  const owedToYou = "525.00 MVR";
  const netOwed = "2,095";

  return (
    <section className="px-4">
      <div className="overflow-hidden rounded-4xl border border-white/90 bg-white/75 p-5 shadow-lg shadow-emerald-900/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] tracking-wide text-neutral-600">
            TOTAL BALANCE
          </p>

          <div className="rounded-2xl p-3 shadow-inner">
            <Scale className="text-emerald-900" size={30} />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-neutral-700">You owe</p>
          <div className="mt-1 flex items-end gap-2">
            <h2 className="text-5xl font-semibold leading-none tracking-tight text-neutral-900">
              {netOwed}
            </h2>
            <p className="pb-1 text-sm text-neutral-500">MVR net</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-neutral-100 px-4 py-3">
            <div className="flex items-center gap-2 text-neutral-600">
              <ArrowDownLeft size={15} />
              <p className="text-xs">Owed to you</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-black">{owedToYou}</p>
          </div>

          <div className="rounded-2xl bg-neutral-100 px-4 py-3">
            <div className="flex items-center gap-2 text-neutral-600">
              <ArrowUpRight size={15} />
              <p className="text-xs">You owe</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-black">{youOwe}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full w-[17%] bg-emerald-800" />
            <div className="h-full w-[83%] bg-neutral-300" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
            <p>Owed to you</p>
            <p>You owe</p>
          </div>
        </div>
      </div>
      <div className="mt-9">
        <div className="flex items-center justify-between px-2 text-black">
          <h2 className="text-xl font-semibold">Active Debts </h2>
          <button className="text-sm font-semibold text-black hover:cursor-pointer">
            View all
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <DebtCards
          title={"YOU OWE"}
          amount={youOwe}
          subtitle={"Across 3 people"}
          colour={"text-black"}
        />
        <DebtCards
          title={"OWED TO YOU"}
          amount={owedToYou}
          subtitle={"Across 2 people"}
          colour={"text-black"}
        />
      </div>

      <UserCards
        title={"Yazak Hafiz"}
        amount={"2,510.00 MVR"}
        colour={"text-black"}
        subtitle={"YOU OWE"}
      />
      <UserCards
        title={"Hafiz Yoosuf"}
        amount={"110.00 MVR"}
        colour={"text-black"}
        subtitle={"YOU OWE"}
      />
      <UserCards
        title={"Dhaisam Shadda"}
        amount={"150.00 MVR"}
        colour={"text-black"}
        subtitle={"OWES YOU"}
      />
      <UserCards
        title={"Zareef idk"}
        amount={"375.00 MVR"}
        colour={"text-black"}
        subtitle={"OWES YOU"}
      />
    </section>
  );
};

export default Home;
