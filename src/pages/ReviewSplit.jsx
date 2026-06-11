import React from "react";
import { ArrowLeft, ChefHat, Users } from "lucide-react";

const ReviewSplit = ({ setActivePage, splitData }) => {
  const borrowedPeople =
    splitData?.participants?.filter(
      (participant) => participant.borrowedFrom,
    ) || [];

  return (
    <div className="min-h-screen bg-neutral-100 px-4 pt-10 text-black">
      <header className="fixed left-1/2 top-0 z-20 w-full max-w-md -translate-x-1/2 border-b  border-white/80 bg-neutral-100/85 px-4 py-4 backdrop-blur-2xl">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => setActivePage("Split")}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-emerald-900 shadow-sm hover:cursor-pointer"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="text-center">
            <p className="text-lg font-medium leading-tight">Review details</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Confirm everything before sending request
            </p>
          </div>
        </div>
      </header>
      <section className="rounded-3xl border border-white/80  bg-white/70 p-5 backdrop-blur-xl">
        <p className="text-sm tracking-wide text-neutral-600 ">TOTAL BILL</p>
        <h1 className="text-4xl  font-thin text-black mt-1.5 border-b border-neutral-200 pb-4">
          {splitData.billAmount ? (
            <span> {splitData.billAmount}.00 </span>
          ) : (
            "0.00"
          )}
          <span className="text-sm px-1 text-neutral-600 "> MVR</span>
        </h1>
        <div className="mt-5 flex">
          <div className="flex items-center justify-between rounded-full border  border-white/10 bg-emerald-100/40 px-2 py-2 ">
            <ChefHat size={25} className="text-emerald-900" />
          </div>
          <div>
            <p className="text-sm px-2 text-neutral-500">Restaurant</p>
            <p className="px-2 text-sm  font-medium">
              {splitData.restaurantName
                ? splitData.restaurantName
                : "Not added"}
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center">
          <div className="flex items-center justify-between rounded-full border  border-white/10 bg-emerald-100/40 px-2 py-2 ">
            <Users size={25} className="text-emerald-900" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-center">
              <p className="text-sm px-2 text-neutral-500">Participants</p>
              <div className=" rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                {borrowedPeople.length > 0
                  ? `${borrowedPeople.length} Borrower${borrowedPeople.length === 1 ? "" : "s"}`
                  : ""}
              </div>
            </div>
            <p className="px-2 text-sm  font-medium ">
              {splitData.peopleCount ? (
                <p>{splitData.peopleCount} people</p>
              ) : (
                "No people"
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5  rounded-3xl border border-white/80 bg-white/70 p-5 backdrop-blur-xl">
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
