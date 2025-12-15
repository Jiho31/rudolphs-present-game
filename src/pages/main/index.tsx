// import React from "react";
import Link from "next/link";

type Props = {};

// export const metadata = {
//   title: "Rudolph's Presents Game",
//   description: "",
// };

function MainPage({}: Props) {
  return (
    <section className="flex flex-col justify-center gap-5 w-[500px] h-dvh mx-auto">
      <h1 className="text-3xl font-bold underline">Rudolph's Game</h1>
      <p>Make a game with your wishlist and share with your friends!</p>

      <div className="flex flex-col gap-5">
        <Link
          href="/new-game"
          className="p-5 rounded-2xl bg-red-600 hover:bg-red-700 hover:cursor-pointer"
        >
          Create new game
        </Link>

        <Link
          href="/results"
          className="p-5 rounded-2xl bg-green-600 hover:bg-green-700 hover:cursor-pointer"
        >
          Check results
        </Link>
      </div>
    </section>
  );
}

export default MainPage;
