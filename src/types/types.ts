import { ItemKey } from "@/game/items";

type GameResult = {
  id?: string;
  player: string;
  score: number;
};

type GameInformation = {
  name: string;
  likes: ItemKey[];
  dislikes: ItemKey[];
  results: GameResult[];
};

export { type GameInformation, type GameResult };
