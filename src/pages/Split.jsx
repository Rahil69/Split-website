import React from "react";
import {
  Utensils,
  ArrowRightLeft,
  TrendingUp,
  CircleSmall,
  ChevronDown,
  User,
} from "lucide-react";
import { useState } from "react";
export const Split = () => {
  const [participants, setParticipants] = useState([]);
  const [peopleCount, setPeopleCount] = useState(null);
  const participantRows = Array.from({ length: peopleCount || 0 });
  const [billAmount, setBillAmount] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [isBillFocused, setIsBillFocused] = useState(false);
  const perPersonAmount =
    billAmount && peopleCount ? Number(billAmount) / peopleCount : "0.00";
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  const handlePeopleCount = (count) => {
    setPeopleCount(count);

    const defaultAmount = billAmount ? Number(billAmount) / count : 0;

    const newParticipants = Array.from({ length: count }, (_, index) => ({
      name: `folk ${index + 1}`,
      borrowedOpen: false,
      borrowedFrom: "",
      amount: defaultAmount.toFixed(2),
    }));

    setParticipants(newParticipants);
  };
  const toggleBorrowed = (indexToToggle) => {
    const updaptedParticipants = participants.map((participant, index) => {
      if (index === indexToToggle) {
        return {
          ...participant,
          borrowedOpen: !participant.borrowedOpen,
        };
      }
      return participant;
    });
    setParticipants(updaptedParticipants);
  };

  return (
    <section className="px-4">
      <div className="flex flex-col items-center px-6 py-6">
        <p className="text-xs tracking-wide text-black">TOTAL BILL</p>

        <div className="mt-3 flex items-center justify-center">
          <span className="text-5xl font-semibold tracking-tight text-neutral-400">
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              onFocus={() => setIsBillFocused(true)}
              onBlur={() => setIsBillFocused(false)}
              placeholder={isBillFocused ? "" : "0.00"}
              className="text-center w-38 bg-transparent font-semibold tracking-tight text-emerald-900 outline-none placeholder:text-neutral-400"
            />
          </span>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-5 rounded-3xl border border-white/80 bg-white/70 px-6 py-6 shadow-lg shadow-emerald-900/10 backdrop-blur-xl">
        <p className="text-xs tracking-wide text-neutral-700">
          WHERE DID YOU EAT?
        </p>

        <div className="flex items-center gap-4 text-xl font-bold tracking-wide">
          <div className="rounded-xl bg-emerald-100/60 p-2">
            <Utensils size={18} className="text-emerald-900" />
          </div>
          <p className="text-neutral-700">
            <input
              type="text"
              placeholder="Restaurant Name "
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="text-4xl outline-none bg-transparent font-semibold tracking-tight text-emerald-900 placeholder:text-neutral-400 placeholder:text-xl"
            />
          </p>
        </div>
      </div>
      <div className="mt-8 px-2">
        <div className="text-sm text-neutral-700">SPLIT BETWEEN</div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          <button
            onClick={() => handlePeopleCount(peopleCount === 2 ? null : 2)}
            className={`rounded-2xl p-4 text-center backdrop-blur hover:cursor-pointer ${
              peopleCount === 2
                ? "duration-100 ease-in border border-neutral-300/70 bg-emerald-100/60 text-emerald-900"
                : "border border-neutral-300/70 bg-white/70 text-emerald-900/80"
            }`}
          >
            <p className="text-xl font-semibold">2</p>
            <p className="mt-1 text-xs text-neutral-700">People</p>
          </button>
          <button
            onClick={() => handlePeopleCount(peopleCount === 3 ? null : 3)}
            className={`rounded-2xl p-4 text-center backdrop-blur hover:cursor-pointer ${
              peopleCount === 3
                ? "duration-100 ease-in border border-neutral-300/70 bg-emerald-100/60 text-emerald-900"
                : "border border-neutral-300/70 bg-white/70 text-emerald-900/80"
            }`}
          >
            <p className="text-xl font-semibold">3</p>
            <p className="mt-1 text-xs text-neutral-700">People</p>
          </button>
          <button
            onClick={() => handlePeopleCount(peopleCount === 4 ? null : 4)}
            className={`rounded-2xl p-4 text-center backdrop-blur hover:cursor-pointer ${
              peopleCount === 4
                ? "duration-100 ease-in border border-neutral-300/70 bg-emerald-100/60 text-emerald-900"
                : "border border-neutral-300/70 bg-white/70 text-emerald-900/80"
            }`}
          >
            <p className="text-xl font-semibold">4</p>
            <p className="mt-1 text-xs text-neutral-700">People</p>
          </button>

          <button className="rounded-2xl border border-neutral-300/70 bg-white/70 p-4 text-center backdrop-blur hover:cursor-pointer">
            <p className="text-xl font-semibold text-emerald-900">5+</p>
            <p className="mt-1 text-xs text-neutral-700">Custom</p>
          </button>
        </div>
      </div>

      {/* participants card */}

      {peopleCount && (
        <div className="mt-6 rounded-3xl border border-white/80 bg-white/70 px-6 py-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-emerald-900">
            Participants
          </h2>
          <p className="mt-1 text-sm text-neutral-700">
            Add who joined the bill
          </p>
          <div className="mt-5 space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="rounded-2xl  px-4 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-emerald-900">
                      <User size={20} className="fill-emerald-900" />
                    </div>
                    <p className="font-semibold text-neutral-700">
                      {participant.name}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-emerald-900">
                    {formatMoney(perPersonAmount)}
                  </p>
                </div>

                <button
                  onClick={() => toggleBorrowed(index)}
                  className="flex bg-emerald-100/40 hover:cursor-pointer mt-3 rounded-full px-3 py-1 !text-xs font-semibold text-emerald-900"
                >
                  BORROWED?
                  <ChevronDown size={15} className="ml-1" />
                </button>
                {participant.borrowedOpen ? (
                  <p className="px-3 py-2 border border-emerald-100 text-sm text-neutral-700">
                    Borrower list
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPLIT NOW  */}

      <button className="mt-7 flex w-full items-center justify-center rounded-2xl bg-emerald-900 py-4 !text-lg font-semibold text-white  hover:cursor-pointer">
        <span className="pr-3">
          <ArrowRightLeft size={25} className="text-white" />
        </span>
        Split Now
      </button>
      <div className="mt-8 rounded-3xl border border-white/80 bg-white/70 px-5 py-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-wide text-neutral-700">
              BALANCE OVERVIEW
            </p>

            <p className="mt-2 text-lg font-semibold text-emerald-900">
              You are owed 420 MVR
            </p>
          </div>

          <TrendingUp size={20} className="text-emerald-900" />
        </div>

        <div className="mt-5 flex items-center justify-between text-xs">
          <p className="text-neutral-800">Receiving</p>
          <p className="text-neutral-800">Owing</p>
        </div>

        <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full w-[80%] bg-emerald-900" />
          <div className="h-full w-[20%] bg-[#e8e8e8]" />
        </div>
      </div>
    </section>
  );
};
