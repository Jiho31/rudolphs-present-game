import React from "react";
import Help from "./icons/Help";

type InstructionsProps = {
  showInstructions: boolean;
  friendName: string;
  handleHelpClick: (e: React.MouseEvent<HTMLElement>) => void;
};

function Instructions({
  showInstructions,
  friendName,
  handleHelpClick,
}: InstructionsProps) {
  if (!showInstructions) {
    return null;
  }

  return (
    <>
      {showInstructions && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-10 bg-black/70 w-full h-full top-0 left-0 flex justify-center items-center"
        >
          <div className="flex flex-col border-2 bg-black border-green-700 p-3 rounded-2xl w-full max-w-[350px] mx-auto">
            <h3 className="font-bold">How to play? </h3>
            <p>
              Move Rudolph to collect the items that "{friendName}" likes and
              avoid the ones they dislike!
            </p>
            <h3 className="font-bold mt-1.5">Controls</h3>
            <p>
              • Press arrow keys (←: left, →: right) <br />• Click/touch left
              half or screen to move left and right half of the screen to move
              right
            </p>
            <h3 className="font-bold mt-1.5">Score</h3>
            <p>Likes: +10 points / Dislikes: -5 points</p>
            <button
              className="self-end cursor-pointer bg-white hover:bg-green-100 border-2 border-green-600 p-2 rounded-2xl text-black text-sm place-self-end"
              onClick={handleHelpClick}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Instructions;
