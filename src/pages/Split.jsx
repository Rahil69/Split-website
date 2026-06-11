import React from "react";
import {
  Utensils,
  ArrowRightLeft,
  TrendingUp,
  CircleSmall,
  ChevronDown,
  User,
  StickyNoteCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
export const Split = ({ setActivePage, setSplitData }) => {
  const [participants, setParticipants] = useState([]);
  const [peopleCount, setPeopleCount] = useState(null);
  const participantRows = Array.from({ length: peopleCount || 0 });
  const [billAmount, setBillAmount] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [isBillFocused, setIsBillFocused] = useState(false);
  const perPersonAmount =
    billAmount && peopleCount ? Number(billAmount) / peopleCount : "0.00";

  // useEffect(() => {
  //   if (!peopleCount) return;

  //   const defaultAmount = billAmount ? Number(billAmount) / peopleCount : 0;
  //   const updatedParticipants = participants.map((participant) => ({
  //     ...participant,
  //     amount: defaultAmount.tofixed(2),
  //   }));
  //   setParticipants(updateParticipants);
  // }, [billAmount, peopleCount]);
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
      name: `Person ${index + 1}`,
      borrowedOpen: false,
      borrowedFrom: "",
      amount: defaultAmount.toFixed(2),
    }));

    setParticipants(newParticipants);
  };
  const toggleBorrowed = (indexToToggle) => {
    const updatedParticipants = participants.map((participant, index) => {
      if (index === indexToToggle) {
        return {
          ...participant,
          borrowedOpen: !participant.borrowedOpen,
        };
      }
      return participant;
    });
    setParticipants(updatedParticipants);
  };

  const updateParticipant = (indexToUpdate, field, value) => {
    const updatedParticipants = participants.map((participant, index) => {
      if (index === indexToUpdate) {
        return {
          ...participant,
          [field]: value,
        };
      }
      return participant;
    });
    setParticipants(updatedParticipants);
  };

  return (
    <section className="px-4">
      <div className="flex flex-col items-center px-6 py-6">
        <p className="text-xs tracking-wide text-black">TOTAL BILL</p>

        <div className="mt-3 flex items-center justify-center">
          <span className="text-5xl font-medium tracking-tight text-neutral-400">
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              onFocus={() => setIsBillFocused(true)}
              onBlur={() => setIsBillFocused(false)}
              placeholder={isBillFocused ? "" : "0.00"}
              className="text-center w-38 bg-transparent !font-medium tracking-tight text-black outline-none placeholder:text-neutral-400"
            />
          </span>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-5 rounded-3xl border border-white/80 bg-white/70 px-6 py-6 shadow-lg shadow-emerald-900/10 backdrop-blur-xl">
        <p className="text-xs tracking-wide text-neutral-700">
          WHERE DID YOU EAT?
        </p>

        <div className="flex items-center gap-4 text-xl font-thin tracking-wide">
          <div className="rounded-full bg-emerald-100/40  p-2">
            <Utensils size={18} className="text-emerald-900" />
          </div>
          <p className="text-neutral-700 ">
            <input
              type="text"
              placeholder="Restaurant Name "
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="text-4xl outline-none bg-transparent font-medium tracking-tight text-black placeholder:text-neutral-400 placeholder:text-xl"
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
                ? "duration-200 ease-in border border-neutral-300/70 bg-emerald-100/70 text-black"
                : "border border-neutral-300/70 bg-white/70 text-black/80"
            }`}
          >
            <p className="text-xl font-medium">2</p>
            <p className="mt-1 text-xs text-neutral-700">People</p>
          </button>
          <button
            onClick={() => handlePeopleCount(peopleCount === 3 ? null : 3)}
            className={`rounded-2xl p-4 text-center backdrop-blur hover:cursor-pointer ${
              peopleCount === 3
                ? "duration-200 ease-in border border-neutral-300/70 bg-emerald-100/70 text-black"
                : "border border-neutral-300/70 bg-white/70 text-black/80"
            }`}
          >
            <p className="text-xl font-medium">3</p>
            <p className="mt-1 text-xs text-neutral-700">People</p>
          </button>
          <button
            onClick={() => handlePeopleCount(peopleCount === 4 ? null : 4)}
            className={`rounded-2xl p-4 text-center backdrop-blur hover:cursor-pointer ${
              peopleCount === 4
                ? "duration-200 ease-in border border-neutral-300/70 bg-emerald-100/70 text-black"
                : "border border-neutral-300/70 bg-white/70 text-black/80"
            }`}
          >
            <p className="text-xl font-medium">4</p>
            <p className="mt-1 text-xs text-neutral-700">People</p>
          </button>

          <button className="rounded-2xl border border-neutral-300/70 bg-white/70 p-4 text-center backdrop-blur hover:cursor-pointer">
            <p className="text-xl font-medium text-black">5+</p>
            <p className="mt-1 text-xs text-neutral-700">Custom</p>
          </button>
        </div>
      </div>

      {/* participants card */}

      {peopleCount && (
        <div className="mt-6 rounded-3xl border border-white/80 bg-white/70 px-6 py-6 backdrop-blur-xl">
          <h2 className="text-xl  text-black">Participants</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Add who joined the bill
          </p>
          <div className="mt-5">
            {participants.map((participant, index) => (
              <div
                key={index}
                className="border-b border-neutral-200/70 px-1 py-4 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-900">
                      <User size={18} className="fill-emerald-900" />
                    </div>

                    <div>
                      <p className="font-thin text-black">{participant.name}</p>
                    </div>
                  </div>

                  <p className="pt-1 text-sm font-medium text-black">
                    {formatMoney(perPersonAmount)}
                  </p>
                </div>

                <button
                  onClick={() => toggleBorrowed(index)}
                  className="mt-4 flex w-full items-center justify-between rounded-2xl bg-neutral-100 px-4 py-2.5 !text-sm !font-thin text-black hover:cursor-pointer"
                >
                  <span>BORROWED?</span>
                  <ChevronDown size={15} />
                </button>
                {participant.borrowedOpen ? (
                  <div className="mt-2 rounded-2xl bg-neutral-50 px-3 py-3">
                    <div className="flex items-center justify-between px-2 text-xs text-neutral-700">
                      <p>BORROWED FROM</p>
                      <p>AMOUNT</p>
                    </div>
                    <div className="mt-2 grid grid-cols-[1.35fr_0.65fr] gap-2 ">
                      <select
                        className="w-full rounded-xl border border-neutral-300 pl-2 py-2 text-sm text-neutral-900 "
                        value={participant.borrowedFrom}
                        onChange={(e) =>
                          updateParticipant(
                            index,
                            "borrowedFrom",
                            e.target.value,
                          )
                        }
                      >
                        <option value="">Select</option>
                        {participants
                          .filter((_, personIndex) => personIndex !== index)
                          .map((person) => (
                            <option key={person.name} value={person.name}>
                              {person.name}
                            </option>
                          ))}
                      </select>

                      <input
                        value={participant.amount}
                        onChange={(e) =>
                          updateParticipant(index, "amount", e.target.value)
                        }
                        className="w-full border rounded-xl border-neutral-300 px-3"
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPLIT NOW  */}

      <button
        onClick={() => {
          setSplitData({
            billAmount,
            restaurantName,
            peopleCount,
            participants,
          });
          setActivePage("ReviewSplit");
        }}
        className="mt-7 flex w-full items-center justify-center rounded-2xl bg-emerald-900 py-4 !text-xl  text-white hover:cursor-pointer"
      >
        <span className="pr-3">
          <StickyNoteCheck size={24} className="text-white" />
        </span>
        Review split
      </button>
      <div className="mt-8 rounded-3xl border border-white/80 bg-white/70 px-5 py-5 backdrop-blur-xl shadow-[0_6px_14px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs !font-thin tracking-wide text-neutral-700">
              BALANCE OVERVIEW
            </p>

            <p className="mt-2 text-lg font-medium text-black">
              You are owed 420 MVR
            </p>
          </div>

          <TrendingUp size={20} className="text-emerald-900" />
        </div>

        <div className="mt-5 flex items-center justify-between text-xs ">
          <p className="text-neutral-800">Receiving</p>
          <p className="text-neutral-800">Owing</p>
        </div>

        <div className="mt-2 flex h-2  overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full w-[80%] bg-emerald-900" />
          <div className="h-full w-[20%] bg-[#e8e8e8]" />
        </div>
      </div>
    </section>
  );
};
