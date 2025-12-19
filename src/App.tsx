import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { useRouter } from "next/router";
import { RudolphGame } from "./game/scenes/RudolphGame";
import { MainMenu } from "./game/scenes/MainMenu";
import { itemKeys } from "./game/items";

function App() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameData, setGameData] = useState<any>({});
  const [friendName, setFriendName] = useState("");

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  useEffect(() => {
    console.log(router.query.gameId);
    if (router.query.gameId && typeof router.query.gameId == "string") {
      setGameId(router.query.gameId);
    } else {
      // @todo redirect to main page ? or play with default items mode
    }
  }, [router]);

  useEffect(() => {
    const gameData = fetchGameData(gameId);
    setGameData(gameData);
    setFriendName(gameData.name || "Friend");
  }, [gameId]);

  // local storage
  const fetchGameData = (gameId: string) => {
    if (!gameId) {
      // @todo handle game id invalid error
      // throw new Error("game id is invalid");
      console.error("game id is invalid");
      return {};
    }
    const data = localStorage.getItem(gameId);
    if (!data) {
      return {};
    }
    return JSON.parse(data);
  };

  const start = () => {
    // @todo handle invalid game data

    const likes = gameData.likes || [itemKeys.SNOWFLAKE];
    const dislikes = gameData.dislikes || ["bomb"];

    if (phaserRef.current) {
      const scene = phaserRef.current.scene as RudolphGame;

      if (scene && scene.scene.key === "RudolphGame") {
        scene.startGame({ likes, dislikes });

        setIsVisible(false);
      }
    }
  };

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Phaser.Scene) => {
    if (scene.scene.key === "RudolphGame") {
      setIsVisible(true);
    }
  };

  return (
    <div id="app">
      {isVisible && (
        <div className="absolute w-full h-full z-10 bg-black/50 flex justify-center items-center">
          <button
            type="button"
            className="w-fit h-fit bg-black p-5 border hover:bg-gray-800 hover:cursor-pointer"
            onClick={start}
          >
            Click to Play
          </button>
        </div>
      )}
      <PhaserGame
        ref={phaserRef}
        currentActiveScene={currentScene}
        gameId={gameId}
        friendName={friendName}
      />
    </div>
  );
}

export default App;
